"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processors = exports.analyticsProcessor = void 0;
const AnalyticsProcessor_1 = __importDefault(require("./AnalyticsProcessor"));
const LoggingProcessor_1 = __importDefault(require("./LoggingProcessor"));
const Processors_1 = __importDefault(require("./Processors"));
exports.analyticsProcessor = new AnalyticsProcessor_1.default();
const loggingProcessor = new LoggingProcessor_1.default();
exports.processors = new Processors_1.default([exports.analyticsProcessor, loggingProcessor]);
//# sourceMappingURL=index.js.map