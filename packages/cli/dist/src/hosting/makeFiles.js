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
exports.getComposeProperty = exports.getEnvProperty = exports.makeSingleCompose = exports.makeEnv = exports.QUICK_CONFIG = exports.ConfigMap = exports.ENV_PATH = exports.COMPOSE_PATH = void 0;
const questions_1 = require("../questions");
const utils_1 = require("../utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const utils_2 = require("./utils");
const randomString = require("randomstring");
const SINGLE_IMAGE = "budibase/budibase:latest";
const VOL_NAME = "budibase_data";
exports.COMPOSE_PATH = path_1.default.resolve("./docker-compose.yaml");
exports.ENV_PATH = path_1.default.resolve("./.env");
function getSecrets(opts = { single: false }) {
    const secrets = [
        "API_ENCRYPTION_KEY",
        "JWT_SECRET",
        "MINIO_ACCESS_KEY",
        "MINIO_SECRET_KEY",
        "REDIS_PASSWORD",
        "INTERNAL_API_KEY",
    ];
    const obj = {};
    secrets.forEach(secret => (obj[secret] = randomString.generate()));
    // setup couch creds separately
    if (opts && opts.single) {
        obj["COUCHDB_USER"] = "admin";
        obj["COUCHDB_PASSWORD"] = randomString.generate();
    }
    else {
        obj["COUCH_DB_USER"] = "admin";
        obj["COUCH_DB_PASSWORD"] = randomString.generate();
    }
    return obj;
}
function getSingleCompose(port) {
    const singleComposeObj = {
        version: "3",
        services: {
            budibase: {
                restart: "unless-stopped",
                image: SINGLE_IMAGE,
                ports: [`${port}:80`],
                environment: getSecrets({ single: true }),
                volumes: [`${VOL_NAME}:/data`],
            },
        },
        volumes: {
            [VOL_NAME]: {
                driver: "local",
            },
        },
    };
    return yaml_1.default.stringify(singleComposeObj);
}
function getEnv(port) {
    const partOne = (0, utils_1.stringifyToDotEnv)({
        MAIN_PORT: port,
    });
    const partTwo = (0, utils_1.stringifyToDotEnv)(getSecrets());
    const partThree = (0, utils_1.stringifyToDotEnv)({
        APP_PORT: 4002,
        WORKER_PORT: 4003,
        MINIO_PORT: 4004,
        COUCH_DB_PORT: 4005,
        REDIS_PORT: 6379,
        WATCHTOWER_PORT: 6161,
        BUDIBASE_ENVIRONMENT: "PRODUCTION",
    });
    return [
        "# Use the main port in the builder for your self hosting URL, e.g. localhost:10000",
        partOne,
        "# This section contains all secrets pertaining to the system",
        partTwo,
        "# This section contains variables that do not need to be altered under normal circumstances",
        partThree,
    ].join("\n");
}
exports.ConfigMap = {
    MAIN_PORT: "port",
};
exports.QUICK_CONFIG = {
    key: "budibase",
    port: 10000,
};
function make(path, contentsFn, inputs = {}, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        const port = inputs.port ||
            (yield (0, questions_1.number)("Please enter the port on which you want your installation to run: ", 10000));
        const fileContents = contentsFn(port);
        fs_1.default.writeFileSync(path, fileContents);
        if (!silent) {
            console.log((0, utils_1.success)(`Configuration has been written successfully - please check ${path} for more details.`));
        }
    });
}
function makeEnv(inputs = {}, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        return make(exports.ENV_PATH, getEnv, inputs, silent);
    });
}
exports.makeEnv = makeEnv;
function makeSingleCompose(inputs = {}, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        return make(exports.COMPOSE_PATH, getSingleCompose, inputs, silent);
    });
}
exports.makeSingleCompose = makeSingleCompose;
function getEnvProperty(property) {
    const props = fs_1.default.readFileSync(exports.ENV_PATH, "utf8").split(property);
    if (props[0].charAt(0) === "=") {
        property = props[0];
    }
    else {
        property = props[1];
    }
    return property.split("=")[1].split("\n")[0];
}
exports.getEnvProperty = getEnvProperty;
function getComposeProperty(property) {
    const { service } = (0, utils_2.getAppService)(exports.COMPOSE_PATH);
    if (property === "port" && Array.isArray(service.ports)) {
        const port = service.ports[0];
        return port.split(":")[0];
    }
    else if (service.environment) {
        return service.environment[property];
    }
    return null;
}
exports.getComposeProperty = getComposeProperty;
