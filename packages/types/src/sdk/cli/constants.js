"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEvent = exports.InitType = exports.CommandWord = void 0;
const events_1 = require("../events");
var CommandWord;
(function (CommandWord) {
    CommandWord["BACKUPS"] = "backups";
    CommandWord["HOSTING"] = "hosting";
    CommandWord["ANALYTICS"] = "analytics";
    CommandWord["HELP"] = "help";
    CommandWord["PLUGIN"] = "plugins";
})(CommandWord || (exports.CommandWord = CommandWord = {}));
var InitType;
(function (InitType) {
    InitType["QUICK"] = "quick";
    InitType["DIGITAL_OCEAN"] = "do";
})(InitType || (exports.InitType = InitType = {}));
exports.AnalyticsEvent = {
    OptOut: "analytics:opt:out",
    OptIn: "analytics:opt:in",
    SelfHostInit: "hosting:init",
    PluginInit: events_1.Event.PLUGIN_INIT,
};
