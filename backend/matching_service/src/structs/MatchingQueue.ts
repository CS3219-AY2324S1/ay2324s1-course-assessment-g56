import {
  NumberToQuestionDifficultyMap,
  QuestionDifficulty,
  QuestionDifficultyToNumberMap,
} from '../types/question';
import { User } from '../types/user';

import LinkedList from './LinkedList';
import Node from './Node';

class MatchingQueue {
  private queues: Map<QuestionDifficulty, LinkedList<User>>;
  // Contains uids, cos a user might have multiple sockets

  private alreadyEnqueued: Map<string, [QuestionDifficulty, Node<User>][]>;

  constructor() {
    this.queues = new Map();
    this.queues.set(QuestionDifficulty.EASY, new LinkedList());
    this.queues.set(QuestionDifficulty.MEDIUM, new LinkedList());
    this.queues.set(QuestionDifficulty.HARD, new LinkedList());
    this.alreadyEnqueued = new Map();
  }

  public isInQueue(uid: string): boolean {
    return this.alreadyEnqueued.has(uid);
  }

  public enqueue(user: User): [QuestionDifficulty, User, User] | undefined {
    if (this.isInQueue(user.uid)) {
      console.log('User already in queue, no change');
      throw new Error();
    }

    const matchingOrder = Array.from(
      {
        length:
          QuestionDifficultyToNumberMap[user.upperBoundDifficulty] -
          QuestionDifficultyToNumberMap[user.lowerBoundDifficulty] +
          1,
      },
      (_, i) =>
        NumberToQuestionDifficultyMap[
          QuestionDifficultyToNumberMap[user.upperBoundDifficulty] - i
        ],
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const difficulty of matchingOrder) {
      const result = this.matchByQueue(user, difficulty);
      if (result) {
        return [difficulty, ...result];
      }
    }

    matchingOrder.forEach((difficulty) => {
      const queue = this.queues.get(difficulty)!;
      const userNode = queue.insertLast(user);
      const userNodes = this.alreadyEnqueued.get(user.uid);
      if (userNodes) {
        userNodes.push([difficulty, userNode]);
      } else {
        this.alreadyEnqueued.set(user.uid, [[difficulty, userNode]]);
      }
    });
  }

  private matchByQueue(
    user: User,
    difficulty: QuestionDifficulty,
  ): [User, User] | undefined {
    const queue = this.queues.get(difficulty);
    if (queue == null) {
      throw new Error(`${difficulty} queue does not exist!`);
    }

    if (queue.length() > 0) {
      const partner = queue.getFirst()!;
      this.remove(partner);
      return [user, partner];
    }
  }

  public remove(user: User): void {
    if (!this.alreadyEnqueued.has(user.uid)) {
      console.log('User not found in alreadyEnqueued!');
      return;
    }

    const userNodes = this.alreadyEnqueued.get(user.uid);
    const userFound = userNodes?.length !== 0;

    if (!userFound) {
      console.log('User not found in all queues!');
      return;
    }

    userNodes?.forEach(([difficulty, userNode]) => {
      console.log(`Removing user from ${difficulty} queue`);
      const queue = this.queues.get(difficulty)!;
      queue.deleteNode(userNode);
    });

    this.alreadyEnqueued.delete(user.uid);
  }
}

export default new MatchingQueue();
