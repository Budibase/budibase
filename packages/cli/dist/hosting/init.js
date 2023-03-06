"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.init = void 0;
const constants_1 = require("../constants");
const questions_1 = require("../questions");
const events_1 = require("../events");
const makeFiles = __importStar(require("./makeFiles"));
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const watch_1 = require("./watch");
const genUser_1 = require("./genUser");
const node_fetch_1 = __importDefault(require("node-fetch"));
const DO_USER_DATA_URL = "http://169.254.169.254/metadata/v1/user-data";
function getInitConfig(type, isQuick, port) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = isQuick ? makeFiles.QUICK_CONFIG : {};
        if (type === constants_1.InitType.DIGITAL_OCEAN) {
            try {
                const output = yield (0, node_fetch_1.default)(DO_USER_DATA_URL);
                const data = yield output.text();
                const response = (0, utils_1.parseEnv)(data);
                for (let [key, value] of Object.entries(makeFiles.ConfigMap)) {
                    if (response[key]) {
                        config[value] = response[key];
                    }
                }
            }
            catch (err) {
                // don't need to handle error, just don't do anything
            }
        }
        // override port
        if (port) {
            config[makeFiles.ConfigMap.MAIN_PORT] = port;
        }
        return config;
    });
}
function init(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let type, isSingle, watchDir, genUser, port, silent;
        if (typeof opts === "string") {
            type = opts;
        }
        else {
            type = opts["init"];
            isSingle = opts["single"];
            watchDir = opts["watchPluginDir"];
            genUser = opts["genUser"];
            port = opts["port"];
            silent = opts["silent"];
        }
        const isQuick = type === constants_1.InitType.QUICK || type === constants_1.InitType.DIGITAL_OCEAN;
        yield (0, utils_2.checkDockerConfigured)();
        if (!isQuick) {
            const shouldContinue = yield (0, questions_1.confirmation)("This will create multiple files in current directory, should continue?");
            if (!shouldContinue) {
                console.log("Stopping.");
                return;
            }
        }
        (0, events_1.captureEvent)(constants_1.AnalyticsEvent.SelfHostInit, {
            type,
        });
        const config = yield getInitConfig(type, isQuick, port);
        if (!isSingle) {
            yield (0, utils_2.downloadDockerCompose)();
            yield makeFiles.makeEnv(config, silent);
        }
        else {
            yield makeFiles.makeSingleCompose(config, silent);
        }
        if (watchDir) {
            yield (0, watch_1.watchPlugins)(watchDir, silent);
        }
        if (genUser) {
            const inputPassword = typeof genUser === "string" ? genUser : null;
            yield (0, genUser_1.generateUser)(inputPassword, silent);
        }
    });
}
exports.init = init;
