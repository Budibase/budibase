"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyToDotEnv = exports.capitaliseFirstLetter = exports.moveDirectory = exports.checkSlashesInUrl = exports.progressBar = exports.parseEnv = exports.logErrorToFile = exports.info = exports.success = exports.error = exports.getSubHelpDescription = exports.getHelpDescription = exports.httpCall = exports.downloadFile = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const path_2 = require("path");
const node_fetch_1 = __importDefault(require("node-fetch"));
const progress = require("cli-progress");
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        filePath = path_1.default.resolve(filePath);
        (0, node_fetch_1.default)(url, {
            method: "GET",
        })
            .then(response => {
            const writer = fs_1.default.createWriteStream(filePath);
            if (response.body) {
                response.body.pipe(writer);
                response.body.on("end", resolve);
                response.body.on("error", reject);
            }
            else {
                throw new Error(`Unable to retrieve docker-compose file - ${response.status}`);
            }
        })
            .catch(err => {
            throw err;
        });
    });
}
exports.downloadFile = downloadFile;
function httpCall(url, method) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)(url, {
            method,
        });
        return response.body;
    });
}
exports.httpCall = httpCall;
function getHelpDescription(str) {
    return chalk_1.default.cyan(str);
}
exports.getHelpDescription = getHelpDescription;
function getSubHelpDescription(str) {
    return chalk_1.default.green(str);
}
exports.getSubHelpDescription = getSubHelpDescription;
function error(err) {
    process.exitCode = -1;
    return chalk_1.default.red(`Error - ${err}`);
}
exports.error = error;
function success(str) {
    return chalk_1.default.green(str);
}
exports.success = success;
function info(str) {
    return chalk_1.default.cyan(str);
}
exports.info = info;
function logErrorToFile(file, error) {
    fs_1.default.writeFileSync(path_1.default.resolve(`./${file}`), `Budibase Error\n${error}`);
}
exports.logErrorToFile = logErrorToFile;
function parseEnv(env) {
    const lines = env.toString().split("\n");
    let result = {};
    for (const line of lines) {
        const match = line.match(/^([^=:#]+?)[=:](.*)/);
        if (match) {
            result[match[1].trim()] = match[2].trim();
        }
    }
    return result;
}
exports.parseEnv = parseEnv;
function progressBar(total) {
    const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
    bar.start(total, 0);
    return bar;
}
exports.progressBar = progressBar;
function checkSlashesInUrl(url) {
    return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
}
exports.checkSlashesInUrl = checkSlashesInUrl;
function moveDirectory(oldPath, newPath) {
    const files = fs_1.default.readdirSync(oldPath);
    // check any file exists already
    for (let file of files) {
        if (fs_1.default.existsSync((0, path_2.join)(newPath, file))) {
            throw new Error("Unable to remove top level directory - some skeleton files already exist.");
        }
    }
    for (let file of files) {
        fs_1.default.renameSync((0, path_2.join)(oldPath, file), (0, path_2.join)(newPath, file));
    }
    fs_1.default.rmdirSync(oldPath);
}
exports.moveDirectory = moveDirectory;
function capitaliseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitaliseFirstLetter = capitaliseFirstLetter;
function stringifyToDotEnv(json) {
    let str = "";
    for (let [key, value] of Object.entries(json)) {
        str += `${key}=${value}\n`;
    }
    return str;
}
exports.stringifyToDotEnv = stringifyToDotEnv;
