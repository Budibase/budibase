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
exports.update = void 0;
const utils_1 = require("./utils");
const questions_1 = require("../questions");
const docker_compose_1 = __importDefault(require("docker-compose"));
const makeFiles_1 = require("./makeFiles");
const utils_2 = require("../utils");
const start_1 = require("./start");
const BB_COMPOSE_SERVICES = ["app-service", "worker-service", "proxy-service"];
const BB_SINGLE_SERVICE = ["budibase"];
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        const { services } = (0, utils_1.getServices)(makeFiles_1.COMPOSE_PATH);
        const isSingle = Object.keys(services).length === 1;
        yield (0, utils_1.checkDockerConfigured)();
        (0, utils_1.checkInitComplete)();
        if (!isSingle &&
            (yield (0, questions_1.confirmation)("Do you wish to update you docker-compose.yaml?"))) {
            // get current MinIO image
            const image = yield (0, utils_1.getServiceImage)("minio");
            yield (0, utils_1.downloadDockerCompose)();
            // replace MinIO image
            (0, utils_1.setServiceImage)("minio", image);
        }
        yield (0, utils_1.handleError)(() => __awaiter(this, void 0, void 0, function* () {
            const status = yield docker_compose_1.default.ps();
            const parts = status.out.split("\n");
            const isUp = parts[2] && parts[2].indexOf("Up") !== -1;
            if (isUp) {
                console.log((0, utils_2.info)("Stopping services, this may take a moment."));
                yield docker_compose_1.default.stop();
            }
            console.log((0, utils_2.info)("Beginning update, this may take a few minutes."));
            let services;
            if (isSingle) {
                services = BB_SINGLE_SERVICE;
            }
            else {
                services = BB_COMPOSE_SERVICES;
            }
            yield docker_compose_1.default.pullMany(services, { log: true });
            if (isUp) {
                console.log((0, utils_2.success)("Update complete, restarting services..."));
                yield (0, start_1.start)();
            }
        }));
    });
}
exports.update = update;
