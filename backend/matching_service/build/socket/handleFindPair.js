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
const socket_1 = require("constants/socket");
const PairingQueue_1 = __importDefault(require("structures/PairingQueue"));
const SidUidMap_1 = __importDefault(require("structures/SidUidMap"));
const UidCallbackMap_1 = __importDefault(require("structures/UidCallbackMap"));
const apiUtils_1 = require("utils/apiUtils");
const TIMEOUT_DURATION = 30000;
const handleFindPair = (socket, io) => {
    return (difficulty) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Socket', socket.id, 'finding pair for', difficulty);
        const uid = SidUidMap_1.default.retrieveUid(socket.id);
        if (uid == null) {
            console.log('Unauthorized, cannot find uid.');
            socket.emit(socket_1.ERROR_FIND_PAIR, 'Unauthorized');
            return;
        }
        if (PairingQueue_1.default.isInQueue(uid)) {
            console.log('User already in queue.');
            socket.emit(socket_1.ERROR_FIND_PAIR, "You're already in the queue! Check your other tabs and windows!");
            return;
        }
        const ratingData = yield (0, apiUtils_1.getRatingData)(uid).catch(() => {
            console.log('Cannot fetch rating data.');
            socket.emit(socket_1.ERROR_FIND_PAIR, 'Something went wrong when trying to find a partner for you! Please try again later.');
        });
        if (!ratingData) {
            return;
        }
        const user = {
            uid,
            sid: socket.id,
            difficulty,
            rating: {
                average: ratingData.average,
                count: ratingData.count,
            },
            githubUsername: ratingData.githubUsername,
            photoUrl: ratingData.photoUrl,
        };
        SidUidMap_1.default.insertUser(socket.id, user);
        let result;
        try {
            result = PairingQueue_1.default.enqueue(user);
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
                console.log("Shag, couldn't find pair. Removing", uid);
                // Leave the queue
                PairingQueue_1.default.remove(user);
                UidCallbackMap_1.default.remove(uid);
                socket.emit(socket_1.RES_CANNOT_FIND_PAIR);
            }, TIMEOUT_DURATION);
            UidCallbackMap_1.default.insert(uid, timeout);
            return;
        }
        // We found a match!
        const [user1, user2] = result;
        const roomId = yield (0, apiUtils_1.createRoom)(user1.uid, user2.uid, difficulty).catch(() => {
            // no-op, consume the error
        });
        if (!roomId) {
            console.log('Failed to create room despite match.');
            // Tell both users that an error occurred.
            // Reason: If we slot them back in again, they will just match again and pass away.
            io.to(user1.uid)
                .to(user2.uid)
                .emit(socket_1.ERROR_FIND_PAIR, "We found someone for you, but we couldn't get you a room! Please try again later.");
            // Clear both users' timeout (although only the other user will have it)
            UidCallbackMap_1.default.stopAndRemove(user1.uid);
            UidCallbackMap_1.default.stopAndRemove(user2.uid);
            return;
        }
        UidCallbackMap_1.default.stopAndRemove(user1.uid);
        UidCallbackMap_1.default.stopAndRemove(user2.uid);
        io.to(user1.uid).emit(socket_1.RES_FOUND_PAIR, {
            roomId,
            partnerUsername: user2.githubUsername,
            partnerPhotoUrl: user2.photoUrl,
        });
        io.to(user2.uid).emit(socket_1.RES_FOUND_PAIR, {
            roomId,
            partnerUsername: user1.githubUsername,
            partnerPhotoUrl: user1.photoUrl,
        });
        console.log('Match found, timeouts cleared, room created.');
    });
};
exports.handleFindPair = handleFindPair;
