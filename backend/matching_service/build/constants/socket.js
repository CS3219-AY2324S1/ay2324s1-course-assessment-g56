"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCONNECT = exports.RES_FOUND_PAIR = exports.ERROR_FIND_PAIR = exports.REQ_STOP_FINDING_PAIR = exports.RES_CANNOT_FIND_PAIR = exports.RES_FIND_PAIR = exports.REQ_FIND_PAIR = exports.CONNECT = void 0;
exports.CONNECT = 'connect';
// From frontend: I want to find a pair
exports.REQ_FIND_PAIR = 'req_find_pair';
// From us: Ok, we're finding a pair for you now
exports.RES_FIND_PAIR = 'res_find_pair';
// From us: Sian 30s have passed, you need to stop finding
exports.RES_CANNOT_FIND_PAIR = 'res_cannot_find_pair';
// From frontend: We pressing cancel
exports.REQ_STOP_FINDING_PAIR = 'req_stop_finding_pair';
// From us: gg, something went wrong. I sent an error string over
exports.ERROR_FIND_PAIR = 'error_find_pair';
// From us: OK here's your room and partner info, enjoy!
exports.RES_FOUND_PAIR = 'res_found_pair';
exports.DISCONNECT = 'disconnect';
