import io, { Socket } from 'socket.io-client';
import { setTimeout } from 'timers/promises';

import 'dotenv/config';

import {
  CONNECT,
  DISCONNECT,
  ERROR_FIND_PAIR,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FOUND_PAIR,
  RES_STOP_FINDING_PAIR,
} from '../src/constants/socket';
import { ApiServer } from '../src/server';
import { QuestionDifficulty } from '../src/types/question';

const serverUrl = `http://localhost:${process.env.MATCHING_SERVICE_PORT}`;

describe('Integration Tests', () => {
  let apiServer: ApiServer;
  let socket1: Socket;
  let socket2: Socket;
  let lastConsoleLog: null;

  beforeAll(async () => {
    apiServer = new ApiServer();
    await apiServer.initialize();
  });

  afterEach(async () => {
    if (socket1) {
      socket1.disconnect();
      socket1.close();
    }
    if (socket2) {
      socket2.disconnect();
      socket2.close();
    }
    lastConsoleLog = null;
  });

  beforeEach(async () => {
    socket1 = io(serverUrl, {
      forceNew: true,
    });

    console.log = (message) => {
      lastConsoleLog = message;
    };
  });

  it('Queue 2 users that match difficulty. Second user joins after 29 seconds. Expect the message "Match found, timeouts cleared, room created." ', async () => {
    socket2 = io(serverUrl, {
      forceNew: true,
    });

    const socket1FoundPair = new Promise<string>((resolve) => {
      socket1.on(RES_FOUND_PAIR, (response) => {
        resolve(response);
      });
    });

    const socket2FoundPair = new Promise<string>((resolve) => {
      socket2.on(RES_FOUND_PAIR, (response) => {
        resolve(response);
      });
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.EASY,
      QuestionDifficulty.MEDIUM,
    );

    // Add a 29-second delay before the second emit
    await setTimeout(29000);
    socket2.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.MEDIUM,
      QuestionDifficulty.HARD,
    );

    await Promise.all([socket1FoundPair, socket2FoundPair]);

    // Check if the last console log message is as expected
    expect(lastConsoleLog).toBe('Match found, timeouts cleared, room created.');
  }, 35000);

  it('Queue 1 user and timeout before 32 seconds[Extra time for messages to appear after dequeueing]', async () => {
    const socket1CannotFindPair = new Promise<string>((resolve) => {
      socket1.on(RES_CANNOT_FIND_PAIR, (response) => {
        resolve(response);
      });
    });

    const expectedDequeueDifficulty = QuestionDifficulty.EASY;
    socket1.emit(
      REQ_FIND_PAIR,
      expectedDequeueDifficulty,
      QuestionDifficulty.HARD,
    );

    await socket1CannotFindPair;

    // For to wait for dequeuing message
    await setTimeout(1000);
    // Check if the last console log message is as expected
    expect(lastConsoleLog).toBe(
      `Removing user from ${expectedDequeueDifficulty} queue`,
    );
  }, 32000);

  it('Queue 2 users but different difficulty. Expect "Removing User" message', async () => {
    socket2 = io(serverUrl, {
      forceNew: true,
    });

    const socket1CannotFindPair = new Promise<string>((resolve) => {
      socket1.on(RES_CANNOT_FIND_PAIR, (response) => {
        resolve(response);
      });
    });

    const socket2CannotFindPair = new Promise<string>((resolve) => {
      socket2.on(RES_CANNOT_FIND_PAIR, (response) => {
        resolve(response);
      });
    });

    const expectedDequeueDifficulty1 = QuestionDifficulty.EASY;
    const expectedDequeueDifficulty2 = QuestionDifficulty.MEDIUM;

    socket1.emit(
      REQ_FIND_PAIR,
      expectedDequeueDifficulty1,
      expectedDequeueDifficulty1,
    );
    socket2.emit(
      REQ_FIND_PAIR,
      expectedDequeueDifficulty2,
      expectedDequeueDifficulty2,
    );

    const expectedMessage1 = `Removing user from ${expectedDequeueDifficulty1} queue`;
    const expectedMessage2 = `Removing user from ${expectedDequeueDifficulty2} queue`;

    await Promise.all([socket1CannotFindPair, socket2CannotFindPair]);
    await await setTimeout(1000);
    // Check if the last console log message is as expected
    expect(
      lastConsoleLog === expectedMessage1 ||
        lastConsoleLog === expectedMessage2,
    ).toBe(true);
  }, 35000);

  it('Queue user but DISCONNECT after 10 seconds. Expect "Socket socketId has disconnected." ', async () => {
    let socketId = '';

    socket1.on(CONNECT, () => {
      socketId = socket1.id;
    });

    const socket1Disconnect = new Promise<string>((resolve) => {
      socket1.on(DISCONNECT, async (response) => {
        await setTimeout(1000);
        resolve(response);
      });
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.EASY,
      QuestionDifficulty.EASY,
    );

    // Wait for 10 seconds and then disconnect the socket
    await setTimeout(10000);
    socket1.disconnect();

    await socket1Disconnect;

    await setTimeout(1000);
    // Check if the last console log message is as expected
    expect(lastConsoleLog).toBe(`Socket ${socketId} has disconnected.`);
  }, 15000);

  it('Queue user but REQ_STOP_FINDING_PAIR after 10 seconds. Expect "Socket socketId has disconnected." ', async () => {
    let socketId = '';

    socket1.on(CONNECT, () => {
      socketId = socket1.id;
    });

    const socket1StopFindingPair = new Promise<string>((resolve) => {
      socket1.on(RES_STOP_FINDING_PAIR, async (response) => {
        await setTimeout(2000);
        resolve(response);
      });
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.EASY,
      QuestionDifficulty.EASY,
    );

    // Wait for 29 seconds and then disconnect the socket
    await setTimeout(29000);
    socket1.emit(REQ_STOP_FINDING_PAIR);

    await socket1StopFindingPair;

    await setTimeout(2000);
    // Check if the last console log message is as expected
    expect(lastConsoleLog).toBe(`User ${socketId} removed from queue.`);
  }, 35000);

  it('Queue the same user twice within 10 seconds after initial queue. Expect "User already in queue."', async () => {
    const socket1ErrorFindPair = new Promise<string>((resolve) => {
      socket1.on(ERROR_FIND_PAIR, async (response) => {
        await setTimeout(1000);
        resolve(response);
      });
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.EASY,
      QuestionDifficulty.EASY,
    );

    // Wait for 10 seconds and then request find pair again
    await setTimeout(10000);
    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.MEDIUM,
      QuestionDifficulty.MEDIUM,
    );

    await socket1ErrorFindPair;

    // Check if the last console log message is as expected
    expect(lastConsoleLog).toBe(`User already in queue.`);
  }, 26000);

  it('Queue the same user twice. Time to requeue is after the timeout time of 30 seconds. Expect "Removing user from difficulty queue"', async () => {
    const expectedDequeueDifficulty = QuestionDifficulty.EASY;
    let failCounter = 0;
    socket1.on(RES_CANNOT_FIND_PAIR, async () => {
      failCounter += 1;
      if (failCounter === 2) {
        await setTimeout(1000);
        // Check if the last console log message is as expected
        expect(lastConsoleLog).toBe(
          `Removing user from ${expectedDequeueDifficulty} queue`,
        );
      }
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionDifficulty.EASY,
      QuestionDifficulty.EASY,
    );

    // Wait for slightly more than 30 seconds and then request find pair again
    await setTimeout(31000);
    socket1.emit(
      REQ_FIND_PAIR,
      expectedDequeueDifficulty,
      QuestionDifficulty.MEDIUM,
    );
  }, 63000);

  afterAll(async () => {
    if (socket1) {
      socket1.disconnect();
      socket1.close();
    }
    if (socket2) {
      socket2.disconnect();
      socket2.close();
    }
    await apiServer.close();
  }, 10000);
});
