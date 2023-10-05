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
exports.handleDisconnect = void 0;
const difficulty_1 = require("../constants/difficulty");
const MatchingQueue_1 = __importDefault(require("../logic/MatchingQueue"));
const handleDisconnect = (socket, _io) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Socket', socket.id, 'is disconnecting.');
        const disconnectedUser = {
            sid: socket.id,
            difficulty: difficulty_1.Difficulty.UNKNOWN
        };
        MatchingQueue_1.default.remove(disconnectedUser);
        console.log('User', disconnectedUser.sid, 'removed from queue.');
        socket.leave(disconnectedUser.sid);
        console.log('Socket', socket.id, 'has disconnected.');
    });
};
exports.handleDisconnect = handleDisconnect;
