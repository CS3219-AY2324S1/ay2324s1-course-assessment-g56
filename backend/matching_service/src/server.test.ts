import io from 'socket.io-client';

import { ApiServer } from './server';

describe('Integration Tests', () => {
  let apiServer: ApiServer;
  const socket = io('http://localhost:6006', {
    autoConnect: false,
  });

  beforeAll(async () => {
    apiServer = new ApiServer();
    await apiServer.initialize();
  });

  it('Test connecting', () => {
    socket.on('connect', () => {
      // Ensure the connection is established
      expect(socket.id).toBeDefined();

      // Perform your assertions here
      // For example, check if the server sent the expected data
      socket.on('your_server_event', (data: string) => {
        expect(data).toEqual('expected_data');

        // You can close the socket and call done to end the test
        socket.disconnect();
      });
    });

    // Trigger the connection
    socket.connect();
  });

  afterAll(async () => {
    // Close the server after all tests are done
    await apiServer.close();
  });
});
