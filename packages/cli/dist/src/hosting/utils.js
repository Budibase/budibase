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
exports.updateDockerComposeService = exports.getAppService = exports.getServices = exports.handleError = exports.checkInitComplete = exports.checkDockerConfigured = exports.downloadDockerCompose = exports.setServiceImage = exports.getServiceImage = void 0;
const lookpath_1 = require("lookpath");
const fs_1 = __importDefault(require("fs"));
const makeFiles = __importStar(require("./makeFiles"));
const utils_1 = require("../utils");
const yaml_1 = __importDefault(require("yaml"));
const ERROR_FILE = "docker-error.log";
const COMPOSE_URL = "https://raw.githubusercontent.com/Budibase/budibase/master/hosting/docker-compose.yaml";
function composeFilename() {
    return COMPOSE_URL.split("/").slice(-1)[0];
}
function getServiceImage(service) {
    const filename = composeFilename();
    try {
        const { services } = getServices(filename);
        const serviceKey = Object.keys(services).find(name => name.includes(service));
        if (serviceKey) {
            return services[serviceKey].image;
        }
        else {
            return null;
        }
    }
    catch (err) {
        return null;
    }
}
exports.getServiceImage = getServiceImage;
function setServiceImage(service, image) {
    const filename = composeFilename();
    if (!fs_1.default.existsSync(filename)) {
        throw new Error(`File ${filename} not found, cannot update ${service} image.`);
    }
    const current = getServiceImage(service);
    let contents = fs_1.default.readFileSync(filename, "utf8");
    contents = contents.replace(`image: ${current}`, `image: ${image}`);
    fs_1.default.writeFileSync(filename, contents);
}
exports.setServiceImage = setServiceImage;
function downloadDockerCompose() {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = composeFilename();
        try {
            yield (0, utils_1.downloadFile)(COMPOSE_URL, `./${filename}`);
        }
        catch (err) {
            console.error((0, utils_1.error)(`Failed to retrieve compose file - ${err}`));
        }
    });
}
exports.downloadDockerCompose = downloadDockerCompose;
function checkDockerConfigured() {
    return __awaiter(this, void 0, void 0, function* () {
        const error = "docker/docker-compose has not been installed, please follow instructions at: https://docs.budibase.com/docs/docker-compose";
        const docker = yield (0, lookpath_1.lookpath)("docker");
        const compose = yield (0, lookpath_1.lookpath)("docker-compose");
        if (!docker || !compose) {
            throw error;
        }
    });
}
exports.checkDockerConfigured = checkDockerConfigured;
function checkInitComplete() {
    if (!fs_1.default.existsSync(makeFiles.ENV_PATH) &&
        !fs_1.default.existsSync(makeFiles.COMPOSE_PATH)) {
        throw "Please run the hosting --init command before any other hosting command.";
    }
}
exports.checkInitComplete = checkInitComplete;
function handleError(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
        }
        catch (err) {
            if (err && err.err) {
                (0, utils_1.logErrorToFile)(ERROR_FILE, err.err);
            }
            throw `Failed to start - logs written to file: ${ERROR_FILE}`;
        }
    });
}
exports.handleError = handleError;
function getServices(path) {
    if (!fs_1.default.existsSync(path)) {
        throw new Error(`No yaml found at path: ${path}`);
    }
    const dockerYaml = fs_1.default.readFileSync(path, "utf8");
    const parsedYaml = yaml_1.default.parse(dockerYaml);
    return { yaml: parsedYaml, services: parsedYaml.services };
}
exports.getServices = getServices;
function getAppService(path) {
    const { yaml, services } = getServices(path), serviceList = Object.keys(services);
    let service;
    if (services["app-service"]) {
        service = services["app-service"];
    }
    else if (serviceList.length === 1) {
        service = services[serviceList[0]];
    }
    return { yaml, service };
}
exports.getAppService = getAppService;
function updateDockerComposeService(
// eslint-disable-next-line no-unused-vars
updateFn) {
    const opts = ["docker-compose.yaml", "docker-compose.yml"];
    const dockerFilePath = opts.find(name => fs_1.default.existsSync(name));
    if (!dockerFilePath) {
        console.log((0, utils_1.error)("Unable to locate docker-compose YAML."));
        return;
    }
    const { yaml: parsedYaml, service } = getAppService(dockerFilePath);
    if (!service) {
        console.log((0, utils_1.error)("Unable to locate service within compose file, is it a valid Budibase configuration?"));
        return;
    }
    updateFn(service);
    fs_1.default.writeFileSync(dockerFilePath, yaml_1.default.stringify(parsedYaml));
}
exports.updateDockerComposeService = updateDockerComposeService;
