"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsClient = void 0;
const posthog_node_1 = __importDefault(require("posthog-node"));
const constants_1 = require("../constants");
const ConfigManager_1 = require("../structures/ConfigManager");
class AnalyticsClient {
    constructor() {
        this.client = new posthog_node_1.default(constants_1.POSTHOG_TOKEN, {});
        this.configManager = new ConfigManager_1.ConfigManager();
    }
    capture(event) {
        if (this.configManager.config.analyticsDisabled)
            return;
        this.client.capture(event);
    }
    enable() {
        this.configManager.removeKey("analyticsDisabled");
        this.client.capture({ event: constants_1.AnalyticsEvent.OptIn, distinctId: "cli" });
    }
    disable() {
        this.client.capture({ event: constants_1.AnalyticsEvent.OptOut, distinctId: "cli" });
        this.configManager.setValue("analyticsDisabled", true);
    }
    status() {
        return this.configManager.config.analyticsDisabled ? "disabled" : "enabled";
    }
}
exports.AnalyticsClient = AnalyticsClient;
