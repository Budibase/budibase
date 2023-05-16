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
exports.getPouches = exports.replication = exports.getConfig = exports.loadEnvironment = exports.askQuestions = exports.checkURLs = exports.MINIO_DIR = exports.COUCH_DIR = exports.TEMP_DIR = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const questions_1 = require("../questions");
const db_1 = require("../core/db");
const backend_core_1 = require("@budibase/backend-core");
exports.TEMP_DIR = ".temp";
exports.COUCH_DIR = "couchdb";
exports.MINIO_DIR = "minio";
const REQUIRED = [
    { value: "MAIN_PORT", default: "10000" },
    {
        value: "COUCH_DB_URL",
        default: "http://budibase:budibase@localhost:10000/db/",
    },
    { value: "MINIO_URL", default: "http://localhost:10000" },
    { value: "MINIO_ACCESS_KEY" },
    { value: "MINIO_SECRET_KEY" },
];
function checkURLs(config) {
    const mainPort = config["MAIN_PORT"], username = config["COUCH_DB_USER"], password = config["COUCH_DB_PASSWORD"];
    if (!config["COUCH_DB_URL"] && mainPort && username && password) {
        config["COUCH_DB_URL"] = `http://${username}:${password}@localhost:${mainPort}/db/`;
    }
    if (!config["MINIO_URL"]) {
        config["MINIO_URL"] = `http://localhost:${mainPort}/`;
    }
    return config;
}
exports.checkURLs = checkURLs;
function askQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("*** NOTE: use a .env file to load these parameters repeatedly ***");
        let config = {};
        for (let property of REQUIRED) {
            config[property.value] = yield (0, questions_1.string)(property.value, property.default);
        }
        return config;
    });
}
exports.askQuestions = askQuestions;
function loadEnvironment(path) {
    if (!fs_1.default.existsSync(path)) {
        throw "Unable to file specified .env file";
    }
    const env = fs_1.default.readFileSync(path, "utf8");
    const config = checkURLs(dotenv_1.default.parse(env));
    for (let required of REQUIRED) {
        if (!config[required.value]) {
            throw `Cannot find "${required.value}" property in .env file`;
        }
    }
    return config;
}
exports.loadEnvironment = loadEnvironment;
// true is the default value passed by commander
function getConfig(envFile = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let config;
        if (envFile !== true) {
            config = loadEnvironment(envFile);
        }
        else {
            config = yield askQuestions();
        }
        // fill out environment
        for (let key of Object.keys(config)) {
            backend_core_1.env._set(key, config[key]);
        }
        return config;
    });
}
exports.getConfig = getConfig;
function replication(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const pouch = (0, db_1.getPouch)();
        try {
            yield pouch.replicate(from, to, {
                batch_size: 1000,
                batches_limit: 5,
                // @ts-ignore
                style: "main_only",
            });
        }
        catch (err) {
            throw new Error(`Replication failed - ${JSON.stringify(err)}`);
        }
    });
}
exports.replication = replication;
function getPouches(config) {
    const Remote = (0, db_1.getPouch)(config["COUCH_DB_URL"]);
    const Local = (0, db_1.getPouch)();
    return { Remote, Local };
}
exports.getPouches = getPouches;
