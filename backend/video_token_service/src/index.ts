const ws = require('ws');
const http = require('http');
const map = require('lib0/map');
const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

require('dotenv').config();

const APP_ID = process.env.NEXT_PUBLIC_AGORA_ID;
const APP_CERTIFICATE = process.env.NEXT_PUBLIC_AGORA_PRIMARY_CERTIFICATE;

const app = express();
const server = http.createServer(app);

const port: string | number = 8080;
const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const wsReadyStateClosing = 2; // eslint-disable-line
const wsReadyStateClosed = 3; // eslint-disable-line

/**
 * A webrtc Signaling server
 */
const pingTimeout = 30000;

const wss = new ws.Server({ noServer: true });

type Message = {
  type: string;
  topics?: string[];
  topic?: string;
  clients?: number;
};

const topics: Map<string, Set<any>> = new Map();

const send = (conn, message: Message): void => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close();
  }
  try {
    conn.send(JSON.stringify(message));
  } catch (e) {
    conn.close();
  }
};

// Provides an endpoint for the browser to check if the signaling server is running.
app.get('/', (req, res) => {
  res.status(200).send('okay');
});

const onconnection = (conn): void => {
  const subscribedTopics: Set<string> = new Set();
  let closed = false;
  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
  }, pingTimeout);

  conn.on('pong', () => {
    // console.log("current topic:", topics);
    console.log('pong received');
    pongReceived = true;
  });
  conn.on('close', () => {
    console.log('WebSocket connection closed');

    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(conn);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  conn.on('error', (error) => {
    console.error('WebSocket error on server:', error);
  });

  conn.on('message', (message) => {
    let parsedMessage: Message;
    if (typeof message === 'string') {
      parsedMessage = JSON.parse(message);
    } else {
      parsedMessage = JSON.parse(message.toString('utf-8'));
    }

    console.log('received message:', parsedMessage);
    if (parsedMessage && parsedMessage.type && !closed) {
      switch (parsedMessage.type) {
        case 'subscribe':
          (parsedMessage.topics || []).forEach((topicName) => {
            if (typeof topicName === 'string') {
              const topic = map.setIfUndefined(
                topics,
                topicName,
                () => new Set(),
              );
              topic.add(conn);
              subscribedTopics.add(topicName);
            }
          });
          break;
        case 'unsubscribe':
          (parsedMessage.topics || []).forEach((topicName) => {
            const subs = topics.get(topicName);
            if (subs) {
              subs.delete(conn);
            }
          });
          break;
        case 'publish':
          console.log('publishing message:', parsedMessage);
          if (parsedMessage.topic) {
            const receivers = topics.get(parsedMessage.topic);
            if (receivers) {
              parsedMessage.clients = receivers.size;
              receivers.forEach((receiver) => send(receiver, parsedMessage));
            }
          }
          break;
        case 'ping':
          send(conn, { type: 'pong' });

          break;
        default:
          break;
      }
    }
  });
};

wss.on('connection', onconnection);

server.on('upgrade', (request, socket, head) => {
  const handleAuth = (ws) => {
    wss.emit('connection', ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

/**
 * Token server
 */

// Forces browser to never cache the response so that we always get a fresh token.
const nocache = (request, response, next) => {
  response.header(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate',
  );
  response.header('Expires', '-1');
  response.header('Pragma', 'no-cache');
  next();
};

const generateAccessToken = (request, response) => {
  // Set response header
  response.header('Access-Control-Allow-Origin', '*');
  // Get channel name
  const { channelName } = request.query;
  if (!channelName) {
    return response.status(500).json({ error: 'Channel name is required' });
  }
  // Get uid
  let { uid } = request.query;
  if (!uid || uid === '') {
    uid = 0;
  }
  // Get role
  let role = RtcRole.SUBSCRIBER;
  if (request.query.role === 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  // Get the expire time
  let { expireTime } = request.query;
  if (!expireTime || expireTime === '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // Calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  // Build the token
  console.log(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime,
  );
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime,
  );
  return response.json({ token });
};

app.get('/access_token', nocache, generateAccessToken);

// app.listen(port, () => {
//   console.log(`Listening on port: ${port}`);
// });
server.listen(port, () => {
  console.log('Signaling server running on localhost:', port);
});
