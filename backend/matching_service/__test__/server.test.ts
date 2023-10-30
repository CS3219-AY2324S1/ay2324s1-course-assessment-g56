import dotenv from 'dotenv';
import io, { Socket } from 'socket.io-client';

// import { REQ_FIND_PAIR, RES_FOUND_PAIR, RES_CANNOT_FIND_PAIR, DISCONNECT, CONNECT, ERROR_FIND_PAIR } from '../src/constants/socket';
import { REQ_FIND_PAIR, RES_CANNOT_FIND_PAIR } from '../src/constants/socket';
import { ApiServer } from '../src/server';
import { QuestionComplexity } from '../src/types/question';

dotenv.config({
  path: '../.env',
});
const serverUrl = 'http://localhost:6006';

describe('Integration Tests', () => {
  let apiServer: ApiServer;
  let socket1: Socket;
  let socket2: Socket;
  // let lastConsoleLog: null;

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
    // lastConsoleLog = null;
  });

  beforeEach(async () => {
    socket1 = io(serverUrl, {
      forceNew: true,
    });

    // console.log = (message) => {
    //   lastConsoleLog = message;
    // };
  });

  // it('Queue 2 users that match difficulty. Second user joins after 29 seconds. Expect the message "Match found, timeouts cleared, room created." ', async () => {
  //   socket2 = io(serverUrl, {
  //     forceNew: true,
  //   });

  //   const promise1 = new Promise<string>((resolve) => {
  //     socket1.on(RES_FOUND_PAIR, (response) => {
  //       resolve(response);
  //     });
  //   });

  //   const promise2 = new Promise<string>((resolve) => {
  //     socket2.on(RES_FOUND_PAIR, (response) => {
  //       resolve(response);
  //     });
  //   });

  //   socket1.emit(REQ_FIND_PAIR, QuestionComplexity.EASY, QuestionComplexity.MEDIUM);

  //   // Add a 29-second delay before the second emit
  //   await new Promise((resolve) => setTimeout(resolve, 29000));

  //   socket2.emit(REQ_FIND_PAIR, QuestionComplexity.MEDIUM, QuestionComplexity.HARD);

  //   await Promise.all([promise1, promise2]);

  //   // Check if the last console log message is as expected
  //   expect(lastConsoleLog).toBe("Match found, timeouts cleared, room created.");

  // }, 35000);

  // it('Queue 1 user and timeout before 32 seconds[Extra time for messages to appear after dequeueing]', async () => {

  //   const promise1 = new Promise<string>((resolve) => {
  //     socket1.on(RES_CANNOT_FIND_PAIR, (response) => {
  //       resolve(response);
  //     });
  //   });

  //   const expectedDequeueDifficulty = QuestionComplexity.EASY
  //   socket1.emit(REQ_FIND_PAIR, expectedDequeueDifficulty, QuestionComplexity.HARD);

  //   await promise1;

  //   // For to wait for dequeuing message
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   // Check if the last console log message is as expected
  //   expect(lastConsoleLog).toBe(`Removing user from ${expectedDequeueDifficulty} queue`);

  // }, 32000);

  // it('Queue 2 users but different difficulty. Expect "Removing User" message', async () => {
  //   socket2 = io(serverUrl, {
  //     forceNew: true,
  //   });

  //   const promise1 = new Promise<string>((resolve) => {
  //     socket1.on(RES_CANNOT_FIND_PAIR, (response) => {
  //       resolve(response);
  //     });
  //   });

  //   const promise2 = new Promise<string>((resolve) => {
  //     socket2.on(RES_CANNOT_FIND_PAIR, (response) => {
  //       resolve(response);
  //     });
  //   });

  //   const expectedDequeueDifficulty = QuestionComplexity.MEDIUM

  //   socket1.emit(REQ_FIND_PAIR, QuestionComplexity.EASY, QuestionComplexity.EASY);
  //   socket2.emit(REQ_FIND_PAIR, expectedDequeueDifficulty, QuestionComplexity.HARD);

  //   await Promise.all([promise1, promise2]);

  //   // Check if the last console log message is as expected
  //   expect(lastConsoleLog).toBe(`Removing user from ${expectedDequeueDifficulty} queue`);

  // }, 35000);

  // it('Queue user but DISCONNECT after 10 seconds. Expect "Socket socketId has disconnected." ', async () => {
  //   let socketId;

  //   socket1.on(CONNECT, () => {
  //     socketId = socket1.id
  //   })

  //   const promise1 = new Promise<string>((resolve) => {
  //     socket1.on(DISCONNECT, (response) => {
  //       setTimeout(() => {
  //         resolve(response);
  //       }, 1000)

  //     });
  //   });

  //   socket1.emit(REQ_FIND_PAIR, QuestionComplexity.EASY, QuestionComplexity.EASY);

  //   // Wait for 10 seconds and then disconnect the socket
  //   setTimeout(() => {
  //     socket1.disconnect();
  //   }, 10000)

  //   await promise1

  //   // Check if the last console log message is as expected
  //   expect(lastConsoleLog).toBe(`Socket ${socketId} has disconnected.`);
  // }, 60000);

  // it('Queue the same user twice within 10 seconds after initial queue. Expect "User already in queue."', async () => {
  //   const promise1 = new Promise<string>((resolve) => {
  //     socket1.on(ERROR_FIND_PAIR, (response) => {
  //       setTimeout(() => {
  //         resolve(response);
  //       }, 5000)

  //     });
  //   });

  //   socket1.emit(REQ_FIND_PAIR, QuestionComplexity.EASY, QuestionComplexity.EASY);

  //   // Wait for 10 seconds and then request find pair again
  //   setTimeout(() => {
  //     socket1.emit(REQ_FIND_PAIR, QuestionComplexity.MEDIUM, QuestionComplexity.MEDIUM);
  //   }, 10000)

  //   await promise1

  //   // Check if the last console log message is as expected
  //   expect(lastConsoleLog).toBe(`User already in queue.`);
  // }, 26000);

  it('Queue the same user twice. Time to requeue is after the timeout time of 30 seconds. Expect "Removing user from difficulty queue"', (done) => {
    const expectedDequeueDifficulty = QuestionComplexity.EASY;
    let failCounter = 0;
    socket1.on(RES_CANNOT_FIND_PAIR, () => {
      failCounter += 1;
      if (failCounter === 2) {
        setTimeout(() => {}, 1000);
        // Check if the last console log message is as expected
        // expect(lastConsoleLog).toBe(`Removing user from ${expectedDequeueDifficulty} queue`);
        done();
      } else {
        fail('Something Went Wrong');
      }
    });

    socket1.emit(
      REQ_FIND_PAIR,
      QuestionComplexity.EASY,
      QuestionComplexity.EASY,
    );

    // Wait for slightly more than 30 seconds and then request find pair again
    setTimeout(() => {
      socket1.emit(
        REQ_FIND_PAIR,
        expectedDequeueDifficulty,
        QuestionComplexity.MEDIUM,
      );
    }, 30500);
  }, 65000);

  afterAll(async () => {
    if (socket1) {
      socket1.disconnect();
      socket1.close();
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
    if (socket2) {
      socket2.disconnect();
      socket2.close();
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
    await apiServer.close();
  }, 15000);
});
