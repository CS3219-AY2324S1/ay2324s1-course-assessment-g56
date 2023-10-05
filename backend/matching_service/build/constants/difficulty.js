"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difficulty = void 0;
var Difficulty;
(function (Difficulty) {
    Difficulty["ANY"] = "ANY";
    Difficulty["EASY"] = "EASY";
    Difficulty["MEDIUM"] = "MEDIUM";
    Difficulty["HARD"] = "HARD";
    //Unknown in the event that the socket disconnects, we need to figure out what difficulty they were in
    Difficulty["UNKNOWN"] = "UNKNOWN";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
