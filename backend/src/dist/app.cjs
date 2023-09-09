"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const service_1 = require("./firebase/service");
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const app = (0, express_1.default)();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "");
app.get("/profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        if (!id) {
            // Dispatch all users if no id is provided
            const { data, error } = yield supabase.from("profiles").select("*");
            if (error)
                throw error;
            res.json(data);
        }
        else {
            const { data, error } = yield supabase
                .from("profiles")
                .select("*")
                .eq("id", id);
            if (error)
                throw error;
            if (data.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(data[0]);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
/**
 * Generates a magic link for a user to login or signup
 *
 * The defacto Create route for users
 */
app.get("/profiles/magic-link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const { data, error } = yield supabase.auth.signInWithOtp({ email });
    if (error) {
        return res.status(500).json(data);
    }
    res.json(data);
}));
/**
 * This is both an update and insert route.
 * https://supabase.com/docs/reference/dart/upsert
 * Upsert creates the row if it doesn't exist, otherwise it updates it.
 * Primary key must be included in the updates.
 *
 * Note: Insert should be handled by magic link invite
 *
 * Updates comes in the form:
 * {id, username, website, avatarURL, updated_at}
 *
 * This faces issues when ran on the server side due to RLS, need to figure out a way to pass auth details
 */
app.put("/profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { updates } = req.body;
    try {
        const { error } = yield supabase.from("profiles").upsert(updates);
        if (error)
            throw error;
        res.json({ message: "Updated successfully" });
    }
    catch (error) {
        res.status(500).json({
            error: `Failed to insert updates: ${JSON.stringify(updates)}. Error: ${error.message}`,
        });
    }
}));
/**
 * Deletes a user
 *
 * Currently it just wipes all attributes of the user in the profiles table without removing the corresponding row
 * and id
 *
 * To do a full delete, we will need to clean the auth.users table as well. Need to write new triggers for that
 *
 *Alternatively, we can keep it as it is and do a soft delete (set isDeleted to true) and remove all profile data instead of a hard delete
 */
app.delete("/profiles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const { data, error } = yield supabase
            .from("profiles")
            .delete()
            .match({ id: id });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
/**
 * Firebase routes
 */
app.get("/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield (0, service_1.getAllQuestions)();
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.post("/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionData = req.body;
        const questionId = yield (0, service_1.addQuestion)(questionData);
        res.json({ uuid: questionId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.put("/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { uuid } = _a, updatedData = __rest(_a, ["uuid"]);
        yield (0, service_1.updateQuestionById)(uuid, updatedData);
        res.json({ message: "Question updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.delete("/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body;
        yield (0, service_1.deleteQuestionById)(uuid);
        res.json({ message: "Question deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get("/questions/getById", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.body;
        const question = yield (0, service_1.getQuestionById)(uuid);
        if (question) {
            res.json(question);
        }
        else {
            res.status(404).json({ message: "Question not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});
//# sourceMappingURL=app.js.map