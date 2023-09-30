import { Difficulty } from '../constants/difficulty';
import { User } from '../constants/user';

class MatchingQueue {
    private queues: Map<Difficulty, User[]>;
    // Contains uids, cos a user might have multiple sockets
    private alreadyEnqueued: Set<string>;

    constructor() {
        this.queues = new Map();
        this.queues.set(Difficulty.EASY, []);
        this.queues.set(Difficulty.MEDIUM, []);
        this.queues.set(Difficulty.HARD, []);
        this.queues.set(Difficulty.ANY, [])
        this.alreadyEnqueued = new Set();
    }

    public isInQueue(sid: string): boolean {
        return this.alreadyEnqueued.has(sid);
    }

    // Fails silently if user is already enqueued
    // In any case, once matched, the match will be broadcasted to all
    // sockets.
    public enqueue(user: User): [User, User] | undefined {
        if (user.difficulty == Difficulty.ANY) {
            return this.enqueueAny(user);
        } else {
            return this.enqueueNormal(user);
        }
    }

    private enqueueNormal(user: User): [User, User] | undefined {
        if (this.isInQueue(user.sid)) {
            console.log('User already in queue, no change');
            throw new Error();
        }

        let result;
        const matchingOrder = [user.difficulty, Difficulty.ANY];
        for (const difficulty of matchingOrder) {
            result = this.matchByQueue(user, difficulty);
            if (result) {
                return result;
            }
        }

        this.alreadyEnqueued.add(user.sid);
        const queue = this.queues.get(user.difficulty)!;
        queue.push(user);
        this.queues.set(user.difficulty, queue);
    }

    private enqueueAny(user: User): [User, User] | undefined {
        if (this.isInQueue(user.sid)) {
            console.log('User already in queue, no change');
            throw new Error();
        }
        
        let result;
        const matchingOrder = [Difficulty.HARD, Difficulty.MEDIUM, Difficulty.EASY, Difficulty.ANY];
        for (const difficulty of matchingOrder) {
            result = this.matchByQueue(user, difficulty);
            if (result) {
                return result;
            }
        }
        
        this.alreadyEnqueued.add(user.sid);
        const queue = this.queues.get(user.difficulty)!;
        queue.push(user);
        this.queues.set(user.difficulty, queue);
    }

    private matchByQueue(user:User, difficulty: Difficulty): [User, User] | undefined {
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

    public remove(user: User): void {
        if (!this.alreadyEnqueued.has(user.sid)) {
            return;
        }
        this.alreadyEnqueued.delete(user.sid);

        if (user.difficulty == Difficulty.UNKNOWN) {
            let userFound;
            let index;
            const searchOrder = [Difficulty.HARD, Difficulty.MEDIUM, Difficulty.EASY, Difficulty.ANY];
            for (const difficulty of searchOrder) {
                console.log("Searching for user in", difficulty, "queue")
                const queue = this.queues.get(difficulty)!;
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
        } else {
            const queue = this.queues.get(user.difficulty)!;
            const index = queue.findIndex((other) => other.sid === user.sid);
            if (index == -1) {
                console.log("User not found in queue!");
            }
            queue.splice(index, 1);
            this.queues.set(user.difficulty, queue);
        }
    }
}

export default new MatchingQueue();