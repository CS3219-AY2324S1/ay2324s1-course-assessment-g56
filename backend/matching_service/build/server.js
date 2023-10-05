"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket"));
const corsOptions = {
    origin: '*',
};
class ApiServer {
    constructor() {
        this.server = null;
        this.io = null;
    }
    initialize(port = 3000) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = (0, express_1.default)();
            app.use(express_1.default.json({ limit: '20mb' }));
            app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
            app.use((0, cors_1.default)(corsOptions));
            app.use((0, helmet_1.default)());
            if (process.env.NODE_ENV !== 'test') {
                console.log(`Express server has started on port ${port}.`);
                app.use((0, morgan_1.default)('dev'));
            }
            const httpServer = (0, http_1.createServer)(app);
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST'],
                },
                maxHttpBufferSize: 1e8,
                pingTimeout: 60000,
                allowEIO3: true,
            });
            httpServer.listen(port, () => {
                console.log(`Server is listening on http://localhost:${port}`);
            });
            (0, socket_1.default)(io);
            this.server = httpServer;
            this.io = io;
        });
    }
    close() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\nShutting down...');
            (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
            (_b = this.io) === null || _b === void 0 ? void 0 : _b.close();
        });
    }
}
exports.ApiServer = ApiServer;
exports.default = ApiServer;
