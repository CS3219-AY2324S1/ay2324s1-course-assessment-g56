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
const PairingQueue_1 = __importDefault(require("structures/PairingQueue"));
const SidUidMap_1 = __importDefault(require("structures/SidUidMap"));
const UidCallbackMap_1 = __importDefault(require("structures/UidCallbackMap"));
const handleDisconnect = (socket, _io) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Socket', socket.id, 'is disconnecting.');
        const [uid, user] = SidUidMap_1.default.remove(socket.id);
        if (user) {
            console.log('User', user.uid, 'removed from queue.');
            PairingQueue_1.default.remove(user);
        }
        UidCallbackMap_1.default.stopAndRemove(uid);
        socket.leave(uid);
        console.log('Socket', socket.id, 'has disconnected.');
    });
};
exports.handleDisconnect = handleDisconnect;
