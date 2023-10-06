"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const apiServer = new server_1.ApiServer();
apiServer.initialize();
exports.default = apiServer;
