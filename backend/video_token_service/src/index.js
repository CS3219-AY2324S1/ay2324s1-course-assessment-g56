var ws = require('ws');
var http = require('http');
var map = require('lib0/map');
var express = require('express');
var _a = require('agora-access-token'), RtcTokenBuilder = _a.RtcTokenBuilder, RtcRole = _a.RtcRole;
require('dotenv').config();
var APP_ID = process.env.NEXT_PUBLIC_AGORA_ID;
var APP_CERTIFICATE = process.env.NEXT_PUBLIC_AGORA_PRIMARY_CERTIFICATE;
var app = express();
var server = http.createServer(app);
var port = 8080;
var wsReadyStateConnecting = 0;
var wsReadyStateOpen = 1;
var wsReadyStateClosing = 2; // eslint-disable-line
var wsReadyStateClosed = 3; // eslint-disable-line
/**
 * A webrtc Signaling server
 */
var pingTimeout = 30000;
var wss = new ws.Server({ noServer: true });
var topics = new Map();
var send = function (conn, message) {
    if (conn.readyState !== wsReadyStateConnecting &&
        conn.readyState !== wsReadyStateOpen) {
        conn.close();
    }
    try {
        conn.send(JSON.stringify(message));
    }
    catch (e) {
        conn.close();
    }
};
// Provides an endpoint for the browser to check if the signaling server is running.
app.get('/', function (req, res) {
    res.status(200).send('okay');
});
var onconnection = function (conn) {
    var subscribedTopics = new Set();
    var closed = false;
    // Check if connection is still alive
    var pongReceived = true;
    var pingInterval = setInterval(function () {
        if (!pongReceived) {
            conn.close();
            clearInterval(pingInterval);
        }
        else {
            pongReceived = false;
            try {
                conn.ping();
            }
            catch (e) {
                conn.close();
            }
        }
    }, pingTimeout);
    conn.on('pong', function () {
        // console.log("current topic:", topics);
        console.log('pong received');
        pongReceived = true;
    });
    conn.on('close', function () {
        console.log('WebSocket connection closed');
        subscribedTopics.forEach(function (topicName) {
            var subs = topics.get(topicName) || new Set();
            subs.delete(conn);
            if (subs.size === 0) {
                topics.delete(topicName);
            }
        });
        subscribedTopics.clear();
        closed = true;
    });
    conn.on('error', function (error) {
        console.error('WebSocket error on server:', error);
    });
    conn.on('message', function (message) {
        var parsedMessage;
        if (typeof message === 'string') {
            parsedMessage = JSON.parse(message);
        }
        else {
            parsedMessage = JSON.parse(message.toString('utf-8'));
        }
        console.log('received message:', parsedMessage);
        if (parsedMessage && parsedMessage.type && !closed) {
            switch (parsedMessage.type) {
                case 'subscribe':
                    (parsedMessage.topics || []).forEach(function (topicName) {
                        if (typeof topicName === 'string') {
                            var topic = map.setIfUndefined(topics, topicName, function () { return new Set(); });
                            topic.add(conn);
                            subscribedTopics.add(topicName);
                        }
                    });
                    break;
                case 'unsubscribe':
                    (parsedMessage.topics || []).forEach(function (topicName) {
                        var subs = topics.get(topicName);
                        if (subs) {
                            subs.delete(conn);
                        }
                    });
                    break;
                case 'publish':
                    console.log('publishing message:', parsedMessage);
                    if (parsedMessage.topic) {
                        var receivers = topics.get(parsedMessage.topic);
                        if (receivers) {
                            parsedMessage.clients = receivers.size;
                            receivers.forEach(function (receiver) { return send(receiver, parsedMessage); });
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
server.on('upgrade', function (request, socket, head) {
    var handleAuth = function (ws) {
        wss.emit('connection', ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
});
/**
 * Token server
 */
// Forces browser to never cache the response so that we always get a fresh token.
var nocache = function (request, response, next) {
    response.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache');
    next();
};
var generateAccessToken = function (request, response) {
    // Set response header
    response.header('Access-Control-Allow-Origin', '*');
    // Get channel name
    var channelName = request.query.channelName;
    if (!channelName) {
        return response.status(500).json({ error: 'Channel name is required' });
    }
    // Get uid
    var uid = request.query.uid;
    if (!uid || uid === '') {
        uid = 0;
    }
    // Get role
    var role = RtcRole.SUBSCRIBER;
    if (request.query.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    }
    // Get the expire time
    var expireTime = request.query.expireTime;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    }
    else {
        expireTime = parseInt(expireTime, 10);
    }
    // Calculate privilege expire time
    var currentTime = Math.floor(Date.now() / 1000);
    var privilegeExpireTime = currentTime + expireTime;
    // Build the token
    console.log(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    var token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    return response.json({ token: token });
};
app.get('/access_token', nocache, generateAccessToken);
// app.listen(port, () => {
//   console.log(`Listening on port: ${port}`);
// });
server.listen(port, function () {
    console.log('Signaling server running on localhost:', port);
});
