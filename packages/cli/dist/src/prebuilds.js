"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const PREBUILDS = "prebuilds";
const ARCH = `${os_1.default.platform()}-${os_1.default.arch()}`;
const PREBUILD_DIR = (0, path_1.join)(process.execPath, "..", PREBUILDS, ARCH);
// running as built CLI pkg bundle
if (!process.argv[0].includes("node")) {
    checkForBinaries();
}
function checkForBinaries() {
    const readDir = (0, path_1.join)(__filename, "..", "..", "..", PREBUILDS, ARCH);
    if (fs_1.default.existsSync(PREBUILD_DIR) || !fs_1.default.existsSync(readDir)) {
        return;
    }
    const natives = fs_1.default.readdirSync(readDir);
    if (fs_1.default.existsSync(readDir)) {
        fs_1.default.mkdirSync(PREBUILD_DIR, { recursive: true });
        for (let native of natives) {
            const filename = `${native.split(".fake")[0]}.node`;
            fs_1.default.cpSync((0, path_1.join)(readDir, native), (0, path_1.join)(PREBUILD_DIR, filename));
        }
    }
}
function cleanup(evt) {
    if (evt && !isNaN(evt)) {
        return;
    }
    if (evt) {
        console.error((0, utils_1.error)("Failed to run CLI command - please report with the following message:"));
        console.error((0, utils_1.error)(evt));
    }
    if (fs_1.default.existsSync(PREBUILD_DIR)) {
        fs_1.default.rmSync(PREBUILD_DIR, { recursive: true });
    }
}
const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"];
events.forEach(event => {
    process.on(event, cleanup);
});
