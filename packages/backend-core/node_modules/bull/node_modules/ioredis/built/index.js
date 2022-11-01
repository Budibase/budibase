"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports = module.exports = require("./redis").default;
var redis_1 = require("./redis");
exports.default = redis_1.default;
var cluster_1 = require("./cluster");
exports.Cluster = cluster_1.default;
var command_1 = require("./command");
exports.Command = command_1.default;
var ScanStream_1 = require("./ScanStream");
exports.ScanStream = ScanStream_1.default;
var pipeline_1 = require("./pipeline");
exports.Pipeline = pipeline_1.default;
var AbstractConnector_1 = require("./connectors/AbstractConnector");
exports.AbstractConnector = AbstractConnector_1.default;
var SentinelConnector_1 = require("./connectors/SentinelConnector");
exports.SentinelConnector = SentinelConnector_1.default;
exports.SentinelIterator = SentinelConnector_1.SentinelIterator;
// No TS typings
exports.ReplyError = require("redis-errors").ReplyError;
const PromiseContainer = require("./promiseContainer");
Object.defineProperty(exports, "Promise", {
    get() {
        return PromiseContainer.get();
    },
    set(lib) {
        PromiseContainer.set(lib);
    },
});
function print(err, reply) {
    if (err) {
        console.log("Error: " + err);
    }
    else {
        console.log("Reply: " + reply);
    }
}
exports.print = print;
