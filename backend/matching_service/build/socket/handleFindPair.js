"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFindPair = void 0;
const socket_1 = require("../constants/socket");
const MatchingQueue_1 = __importDefault(require("../logic/MatchingQueue"));
const TIMEOUT_DURATION = 30000;
const handleFindPair = (socket, io) => {
    return (difficulty) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            sid: socket.id,
            difficulty: difficulty
        };
        console.log('Socket', newUser.sid, 'finding pair for', difficulty);
        socket.join(newUser.sid);
        if (MatchingQueue_1.default.isInQueue(newUser.sid)) {
            console.log('User already in queue.');
            socket.emit(socket_1.ERROR_FIND_PAIR, "You're already in the queue! Check your other tabs and windows!");
            return;
        }
        let result;
        try {
            result = MatchingQueue_1.default.enqueue(newUser);
        }
        catch (_a) {
            socket.emit(socket_1.ERROR_FIND_PAIR, 'Something went wrong! Please refresh and try again.');
            return;
        }
        // Let the frontend know we're looking for a pair now.
        socket.emit(socket_1.RES_FIND_PAIR);
        // No match
        if (result == null) {
            console.log('No current match found, setting timeout.');
            const timeout = setTimeout(() => {
                console.log("Could not find pair in time", newUser.sid);
                // Leave the queue
                MatchingQueue_1.default.remove(newUser);
                socket.emit(socket_1.RES_CANNOT_FIND_PAIR);
            }, TIMEOUT_DURATION);
            return;
        }
        // We found a match!
        const [user1, user2] = result;
        console.log('Match found:', user1.sid, user2.sid);
        io.to(user1.sid).emit(socket_1.RES_FOUND_PAIR, {
            roomId: "test"
        });
        io.to(user2.sid).emit(socket_1.RES_FOUND_PAIR, {
            roomId: "test"
        });
        MatchingQueue_1.default.remove(user1);
        MatchingQueue_1.default.remove(user2);
        console.log('Match found, timeouts cleared, room created.');
    });
};
exports.handleFindPair = handleFindPair;
