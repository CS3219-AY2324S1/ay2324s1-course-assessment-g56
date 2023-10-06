"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const SidUidMap_1 = __importDefault(require("structures/SidUidMap"));
const apiUtils_1 = require("utils/apiUtils");
const authMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    (0, apiUtils_1.getUid)(token)
        .then((uid) => {
        SidUidMap_1.default.insertUid(socket.id, uid);
        // Join the room
        socket.join(uid);
        next();
    })
        .catch(() => {
        next(new Error('Unauthorized'));
    });
};
exports.authMiddleware = authMiddleware;
