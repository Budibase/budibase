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
exports.fleshOutSkeleton = exports.getSkeleton = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const string_templates_1 = require("@budibase/string-templates");
const download = require("download");
const tar = require("tar");
const HBS_FILES = ["package.json.hbs", "schema.json.hbs", "README.md.hbs"];
function getSkeletonUrl(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield (0, node_fetch_1.default)("https://api.github.com/repos/budibase/budibase-skeleton/releases/latest");
        if (resp.status >= 300) {
            throw new Error("Failed to retrieve skeleton metadata");
        }
        const json = (yield resp.json());
        for (let asset of json["assets"]) {
            if (asset.name && asset.name.includes(type)) {
                return asset["browser_download_url"];
            }
        }
        throw new Error("No skeleton found in latest release.");
    });
}
function getSkeleton(type, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = yield getSkeletonUrl(type);
        const tarballFile = (0, path_1.join)(os_1.default.tmpdir(), "skeleton.tar.gz");
        // download the full skeleton tarball
        fs_1.default.writeFileSync(tarballFile, yield download(url));
        fs_1.default.mkdirSync(name);
        // extract it and get what we need
        yield tar.extract({
            file: tarballFile,
            C: name,
        });
        // clear up
        fs_1.default.rmSync(tarballFile);
    });
}
exports.getSkeleton = getSkeleton;
function fleshOutSkeleton(type, name, description, version) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of HBS_FILES) {
            const oldFile = (0, path_1.join)(name, file), newFile = (0, path_1.join)(name, file.substring(0, file.length - 4));
            const hbsContents = fs_1.default.readFileSync(oldFile, "utf8");
            if (!hbsContents) {
                continue;
            }
            const output = (0, string_templates_1.processStringSync)(hbsContents, {
                name,
                description,
                version,
            });
            // write the updated file and remove the HBS file
            fs_1.default.writeFileSync(newFile, output);
            fs_1.default.rmSync(oldFile);
        }
    });
}
exports.fleshOutSkeleton = fleshOutSkeleton;
