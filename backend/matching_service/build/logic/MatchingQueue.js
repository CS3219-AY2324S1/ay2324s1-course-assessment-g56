"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const difficulty_1 = require("../constants/difficulty");
class MatchingQueue {
    constructor() {
        this.queues = new Map();
        this.queues.set(difficulty_1.Difficulty.EASY, []);
        this.queues.set(difficulty_1.Difficulty.MEDIUM, []);
        this.queues.set(difficulty_1.Difficulty.HARD, []);
        this.queues.set(difficulty_1.Difficulty.ANY, []);
        this.alreadyEnqueued = new Set();
    }
    isInQueue(sid) {
        return this.alreadyEnqueued.has(sid);
    }
    // Fails silently if user is already enqueued
    // In any case, once matched, the match will be broadcasted to all
    // sockets.
    enqueue(user) {
        if (user.difficulty == difficulty_1.Difficulty.ANY) {
            return this.enqueueAny(user);
        }
        else {
            return this.enqueueNormal(user);
        }
    }
    enqueueNormal(user) {
        if (this.isInQueue(user.sid)) {
            console.log('User already in queue, no change');
            throw new Error();
        }
        let result;
        const matchingOrder = [user.difficulty, difficulty_1.Difficulty.ANY];
        for (const difficulty of matchingOrder) {
            result = this.matchByQueue(user, difficulty);
            if (result) {
                return result;
            }
        }
        this.alreadyEnqueued.add(user.sid);
        const queue = this.queues.get(user.difficulty);
        queue.push(user);
        this.queues.set(user.difficulty, queue);
    }
    enqueueAny(user) {
        if (this.isInQueue(user.sid)) {
            console.log('User already in queue, no change');
            throw new Error();
        }
        let result;
        const matchingOrder = [difficulty_1.Difficulty.HARD, difficulty_1.Difficulty.MEDIUM, difficulty_1.Difficulty.EASY, difficulty_1.Difficulty.ANY];
        for (const difficulty of matchingOrder) {
            result = this.matchByQueue(user, difficulty);
            if (result) {
                return result;
            }
        }
        this.alreadyEnqueued.add(user.sid);
        const queue = this.queues.get(user.difficulty);
        queue.push(user);
        this.queues.set(user.difficulty, queue);
    }
    matchByQueue(user, difficulty) {
        const queue = this.queues.get(difficulty);
        if (queue == null) {
            console.log(user.difficulty, " queue is null??");
            throw new Error();
        }
        if (queue.length > 0) {
            const partner = queue[0];
            if (partner) {
                this.remove(partner);
                return [user, partner];
            }
        }
    }
    remove(user) {
        if (!this.alreadyEnqueued.has(user.sid)) {
            return;
        }
        this.alreadyEnqueued.delete(user.sid);
        if (user.difficulty == difficulty_1.Difficulty.UNKNOWN) {
            let userFound;
            let index;
            const searchOrder = [difficulty_1.Difficulty.HARD, difficulty_1.Difficulty.MEDIUM, difficulty_1.Difficulty.EASY, difficulty_1.Difficulty.ANY];
            for (const difficulty of searchOrder) {
                console.log("Searching for user in", difficulty, "queue");
                const queue = this.queues.get(difficulty);
                const index = queue.findIndex((other) => other.sid === user.sid);
                if (index != -1) {
                    queue.splice(index, 1);
                    this.queues.set(user.difficulty, queue);
                    userFound = true;
                }
            }
            if (!userFound) {
                //Possible for user to not be in a queue when disconnect
                console.log("User not found in all queues!");
            }
        }
        else {
            const queue = this.queues.get(user.difficulty);
            const index = queue.findIndex((other) => other.sid === user.sid);
            if (index == -1) {
                console.log("User not found in queue!");
            }
            queue.splice(index, 1);
            this.queues.set(user.difficulty, queue);
        }
    }
}
exports.default = new MatchingQueue();
