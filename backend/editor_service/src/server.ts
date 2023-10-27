#!/usr/bin/env node

import ws from 'ws';
import http from 'http';
import * as map from 'lib0/map';

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

const pingTimeout = 30000;

const port: string | number = process.env.PORT || 4444;
const wss = new ws.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

type Message = {
  type: string;
  topics?: string[];
  topic?: string;
  clients?: number;
};

const topics: Map<string, Set<ws>> = new Map();

const send = (conn: ws, message: Message): void => {
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

const onconnection = (conn: ws): void => {
  const subscribedTopics: Set<string> = new Set();
  let closed = false;
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
    pongReceived = true;
  });
  conn.on('close', () => {
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
  conn.on('message', (message: ws.Data) => {
    let parsedMessage: Message;
    if (typeof message === 'string') {
      parsedMessage = JSON.parse(message);
    } else {
      return;
    }
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
  const handleAuth = (ws: ws) => {
    wss.emit('connection', ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port);

console.log('Signaling server running on localhost:', port);
