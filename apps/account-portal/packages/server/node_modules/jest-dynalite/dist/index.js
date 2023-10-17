"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDb = exports.startDb = exports.setup = exports.createTables = exports.deleteTables = void 0;
var db_1 = require("./db");
Object.defineProperty(exports, "deleteTables", { enumerable: true, get: function () { return db_1.deleteTables; } });
Object.defineProperty(exports, "createTables", { enumerable: true, get: function () { return db_1.createTables; } });
var setup_1 = require("./setup");
Object.defineProperty(exports, "setup", { enumerable: true, get: function () { return __importDefault(setup_1).default; } });
var db_2 = require("./db");
Object.defineProperty(exports, "startDb", { enumerable: true, get: function () { return db_2.start; } });
Object.defineProperty(exports, "stopDb", { enumerable: true, get: function () { return db_2.stop; } });
//# sourceMappingURL=index.js.map