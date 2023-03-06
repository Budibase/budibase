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
exports.stop = void 0;
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const docker_compose_1 = __importDefault(require("docker-compose"));
function stop() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, utils_1.checkDockerConfigured)();
        (0, utils_1.checkInitComplete)();
        console.log((0, utils_2.info)("Stopping services, this may take a moment."));
        yield (0, utils_1.handleError)(() => __awaiter(this, void 0, void 0, function* () {
            yield docker_compose_1.default.stop();
        }));
        console.log((0, utils_2.success)("Services have been stopped successfully."));
    });
}
exports.stop = stop;
