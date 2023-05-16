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
exports.runPkgCommand = exports.utilityInstalled = exports.exec = void 0;
const util_1 = __importDefault(require("util"));
const runCommand = util_1.default.promisify(require("child_process").exec);
function exec(command, dir = "./") {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield runCommand(command, { cwd: dir });
        return stdout;
    });
}
exports.exec = exec;
function utilityInstalled(utilName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exec(`${utilName} --version`);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
exports.utilityInstalled = utilityInstalled;
function runPkgCommand(command, dir = "./") {
    return __awaiter(this, void 0, void 0, function* () {
        const yarn = yield exports.utilityInstalled("yarn");
        const npm = yield exports.utilityInstalled("npm");
        if (!yarn && !npm) {
            throw new Error("Must have yarn or npm installed to run build.");
        }
        const npmCmd = command === "install" ? `npm ${command}` : `npm run ${command}`;
        const cmd = yarn ? `yarn ${command} --ignore-engines` : npmCmd;
        yield exports.exec(cmd, dir);
    });
}
exports.runPkgCommand = runPkgCommand;
