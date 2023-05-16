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
const Command_1 = require("../structures/Command");
const constants_1 = require("../constants");
const skeleton_1 = require("./skeleton");
const questions = __importStar(require("../questions"));
const fs_1 = __importDefault(require("fs"));
const types_1 = require("@budibase/types");
const backend_core_1 = require("@budibase/backend-core");
const exec_1 = require("../exec");
const path_1 = require("path");
const utils_1 = require("../utils");
const events_1 = require("../events");
const constants_2 = require("../constants");
const init_1 = require("../hosting/init");
const start_1 = require("../hosting/start");
const fp = require("find-free-port");
function checkInPlugin() {
    if (!fs_1.default.existsSync("package.json")) {
        throw new Error("Please run in a plugin directory - must contain package.json");
    }
    if (!fs_1.default.existsSync("schema.json")) {
        throw new Error("Please run in a plugin directory - must contain schema.json");
    }
}
function askAboutTopLevel(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = fs_1.default.readdirSync(process.cwd());
        // we are in an empty git repo, don't ask
        if (files.find(file => file === ".git")) {
            return false;
        }
        else {
            console.log((0, utils_1.info)(`By default the plugin will be created in the directory "${name}"`));
            console.log((0, utils_1.info)("if you are already in an empty directory, such as a new Git repo, you can disable this functionality."));
            return questions.confirmation("Create top level directory?");
        }
    });
}
function init(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const type = opts["init"] || opts;
        if (!type || !types_1.PLUGIN_TYPE_ARR.includes(type)) {
            console.log((0, utils_1.error)("Please provide a type to init, either 'component', 'datasource' or 'automation'."));
            return;
        }
        console.log((0, utils_1.info)("Lets get some details about your new plugin:"));
        const name = yield questions.string("Name", `budibase-${type}`);
        if (fs_1.default.existsSync(name)) {
            console.log((0, utils_1.error)("Directory by plugin name already exists, pick a new name."));
            return;
        }
        const description = yield questions.string("Description", `An amazing Budibase ${type}!`);
        const version = yield questions.string("Version", "1.0.0");
        const topLevel = yield askAboutTopLevel(name);
        // get the skeleton
        console.log((0, utils_1.info)("Retrieving project..."));
        yield (0, skeleton_1.getSkeleton)(type, name);
        yield (0, skeleton_1.fleshOutSkeleton)(type, name, description, version);
        console.log((0, utils_1.info)("Installing dependencies..."));
        yield (0, exec_1.runPkgCommand)("install", (0, path_1.join)(process.cwd(), name));
        // if no parent directory desired move to cwd
        if (!topLevel) {
            (0, utils_1.moveDirectory)(name, process.cwd());
            console.log((0, utils_1.info)(`Plugin created in current directory.`));
        }
        else {
            console.log((0, utils_1.info)(`Plugin created in directory "${name}"`));
        }
        (0, events_1.captureEvent)(constants_1.AnalyticsEvent.PluginInit, {
            type,
            name,
            description,
            version,
        });
    });
}
function verify() {
    return __awaiter(this, void 0, void 0, function* () {
        // will throw errors if not acceptable
        checkInPlugin();
        console.log((0, utils_1.info)("Verifying plugin..."));
        const schema = fs_1.default.readFileSync("schema.json", "utf8");
        const pkg = fs_1.default.readFileSync("package.json", "utf8");
        let name, version;
        try {
            const schemaJson = JSON.parse(schema);
            const pkgJson = JSON.parse(pkg);
            if (!pkgJson.name || !pkgJson.version || !pkgJson.description) {
                throw new Error("package.json is missing one of 'name', 'version' or 'description'.");
            }
            name = pkgJson.name;
            version = pkgJson.version;
            backend_core_1.plugins.validate(schemaJson);
            return { name, version };
        }
        catch (err) {
            if (err && err.message && err.message.includes("not valid JSON")) {
                console.log((0, utils_1.error)(`schema.json is not valid JSON: ${err.message}`));
            }
            else {
                console.log((0, utils_1.error)(`Invalid schema/package.json: ${err.message}`));
            }
        }
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function* () {
        const verified = yield verify();
        if (!(verified === null || verified === void 0 ? void 0 : verified.name)) {
            return;
        }
        console.log((0, utils_1.success)("Verified!"));
        console.log((0, utils_1.info)("Building plugin..."));
        yield (0, exec_1.runPkgCommand)("build");
        const output = (0, path_1.join)("dist", `${verified.name}-${verified.version}.tar.gz`);
        console.log((0, utils_1.success)(`Build complete - output in: ${output}`));
    });
}
function watch() {
    return __awaiter(this, void 0, void 0, function* () {
        const verified = yield verify();
        if (!(verified === null || verified === void 0 ? void 0 : verified.name)) {
            return;
        }
        const output = (0, path_1.join)("dist", `${verified.name}-${verified.version}.tar.gz`);
        console.log((0, utils_1.info)(`Watching - build in: ${output}`));
        try {
            yield (0, exec_1.runPkgCommand)("watch");
        }
        catch (err) {
            // always errors when user escapes
            console.log((0, utils_1.success)("Watch exited."));
        }
    });
}
function dev() {
    return __awaiter(this, void 0, void 0, function* () {
        const pluginDir = yield questions.string("Directory to watch", "./");
        const [port] = yield fp(10000);
        const password = "admin";
        yield (0, init_1.init)({
            init: constants_1.InitType.QUICK,
            single: true,
            watchPluginDir: pluginDir,
            genUser: password,
            port,
            silent: true,
        });
        yield (0, start_1.start)();
        console.log((0, utils_1.success)(`Configuration has been written to docker-compose.yaml`));
        console.log((0, utils_1.success)("Development environment started successfully - connect at: ") +
            (0, utils_1.info)(`http://localhost:${port}`));
        console.log((0, utils_1.success)("Use the following credentials to login:"));
        console.log((0, utils_1.success)("Email: ") + (0, utils_1.info)(constants_2.GENERATED_USER_EMAIL));
        console.log((0, utils_1.success)("Password: ") + (0, utils_1.info)(password));
    });
}
exports.default = new Command_1.Command(`${constants_1.CommandWord.PLUGIN}`)
    .addHelp("Custom plugins for Budibase, init, build and verify your components and datasources with this tool.")
    .addSubOption("--init [type]", "Init a new plugin project, with a type of either component or datasource.", init)
    .addSubOption("--build", "Build your plugin, this will verify and produce a final tarball for your project.", build)
    .addSubOption("--watch", "Automatically build any changes to your plugin.", watch)
    .addSubOption("--dev", "Run a development environment which automatically watches the current directory.", dev);
