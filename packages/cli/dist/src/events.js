"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureEvent = void 0;
const Client_1 = require("./analytics/Client");
const client = new Client_1.AnalyticsClient();
function captureEvent(event, properties) {
    client.capture({
        distinctId: "cli",
        event,
        properties,
    });
}
exports.captureEvent = captureEvent;
