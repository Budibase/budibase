"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommands = void 0;
const analytics_1 = __importDefault(require("./analytics"));
const hosting_1 = __importDefault(require("./hosting"));
const backups_1 = __importDefault(require("./backups"));
const plugins_1 = __importDefault(require("./plugins"));
function getCommands() {
    return [hosting_1.default, analytics_1.default, backups_1.default, plugins_1.default];
}
exports.getCommands = getCommands;
