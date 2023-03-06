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
exports.watchPlugins = void 0;
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const utils_2 = require("./utils");
function watchPlugins(pluginPath, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        const PLUGIN_PATH = "/plugins";
        // get absolute path
        pluginPath = (0, path_1.resolve)(pluginPath);
        if (!fs_1.default.existsSync(pluginPath)) {
            console.log((0, utils_1.error)(`The directory "${pluginPath}" does not exist, please create and then try again.`));
            return;
        }
        (0, utils_2.updateDockerComposeService)((service) => {
            // set environment variable
            service.environment["PLUGINS_DIR"] = PLUGIN_PATH;
            // add volumes to parsed yaml
            if (!service.volumes) {
                service.volumes = [];
            }
            const found = service.volumes.find(vol => vol.includes(PLUGIN_PATH));
            if (found) {
                service.volumes.splice(service.volumes.indexOf(found), 1);
            }
            service.volumes.push(`${pluginPath}:${PLUGIN_PATH}`);
        });
        if (!silent) {
            console.log((0, utils_1.success)(`Docker compose configured to watch directory: ${pluginPath}`));
        }
    });
}
exports.watchPlugins = watchPlugins;
