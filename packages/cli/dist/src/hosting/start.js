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
exports.start = void 0;
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const makeFiles = __importStar(require("./makeFiles"));
const docker_compose_1 = __importDefault(require("docker-compose"));
const fs_1 = __importDefault(require("fs"));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkDockerConfigured)();
        (0, utils_1.checkInitComplete)();
        console.log((0, utils_2.info)("Starting services, this may take a moment - first time this may take a few minutes to download images."));
        let port;
        if (fs_1.default.existsSync(makeFiles.ENV_PATH)) {
            port = makeFiles.getEnvProperty("MAIN_PORT");
        }
        else {
            port = makeFiles.getComposeProperty("port");
        }
        yield (0, utils_1.handleError)(() => __awaiter(this, void 0, void 0, function* () {
            // need to log as it makes it more clear
            yield docker_compose_1.default.upAll({ cwd: "./", log: true });
        }));
        console.log((0, utils_2.success)(`Services started, please go to http://localhost:${port} for next steps.`));
    });
}
exports.start = start;
