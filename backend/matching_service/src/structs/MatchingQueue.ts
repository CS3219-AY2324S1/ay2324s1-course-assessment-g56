import {
  NumberToQuestionComplexityMap,
  QuestionComplexity,
  QuestionComplexityToNumberMap,
} from '../types/question';
import { User } from '../types/user';

import LinkedList from './LinkedList';
import Node from './Node';

class MatchingQueue {
  private queues: Map<QuestionComplexity, LinkedList<User>>;
  // Contains uids, cos a user might have multiple sockets

  private alreadyEnqueued: Map<string, [QuestionComplexity, Node<User>][]>;

  constructor() {
    this.queues = new Map();
    this.queues.set(QuestionComplexity.EASY, new LinkedList());
    this.queues.set(QuestionComplexity.MEDIUM, new LinkedList());
    this.queues.set(QuestionComplexity.HARD, new LinkedList());
    this.alreadyEnqueued = new Map();
  }

  public isInQueue(uid: string): boolean {
    return this.alreadyEnqueued.has(uid);
  }

  public enqueue(user: User): [QuestionComplexity, User, User] | undefined {
    if (this.isInQueue(user.uid)) {
      console.log('User already in queue, no change');
      throw new Error();
    }

    const matchingOrder = Array.from(
      {
        length:
          QuestionComplexityToNumberMap[user.upperBoundDifficulty] -
          QuestionComplexityToNumberMap[user.lowerBoundDifficulty] +
          1,
      },
      (_, i) =>
        NumberToQuestionComplexityMap[
          QuestionComplexityToNumberMap[user.upperBoundDifficulty] - i
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
    difficulty: QuestionComplexity,
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
