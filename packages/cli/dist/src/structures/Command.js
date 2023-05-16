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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const utils_1 = require("../utils");
class Command {
    constructor(command, func) {
        // if there are options, need to just get the command name
        this.command = command;
        this.opts = [];
        this.func = func;
    }
    convertToCommander(lookup) {
        const parts = lookup.toLowerCase().split("-");
        // camel case, separate out first
        const first = parts.shift();
        return [first]
            .concat(parts.map(part => (0, utils_1.capitaliseFirstLetter)(part)))
            .join("");
    }
    addHelp(help) {
        this.help = help;
        return this;
    }
    addSubOption(command, help, func, extras = []) {
        this.opts.push({ command, help, func, extras });
        return this;
    }
    configure(program) {
        const thisCmd = this;
        let command = program.command(thisCmd.command);
        if (this.help) {
            command = command.description((0, utils_1.getHelpDescription)(thisCmd.help));
        }
        for (let opt of thisCmd.opts) {
            command = command.option(opt.command, (0, utils_1.getSubHelpDescription)(opt.help));
        }
        command.helpOption("--help", (0, utils_1.getSubHelpDescription)(`Get help with ${this.command} options`));
        command.action((options) => __awaiter(this, void 0, void 0, function* () {
            try {
                let executed = false, found = false;
                for (let opt of thisCmd.opts) {
                    let lookup = opt.command.split(" ")[0].replace("--", "");
                    // need to handle how commander converts watch-plugin-dir to watchPluginDir
                    lookup = this.convertToCommander(lookup);
                    found = !executed && !!options[lookup];
                    if (found && opt.func) {
                        const input = Object.keys(options).length > 1 ? options : options[lookup];
                        yield opt.func(input);
                        executed = true;
                    }
                }
                if (found && !executed) {
                    console.log((0, utils_1.error)(`${Object.keys(options)[0]} is an option, not an operation.`));
                }
                else if (!executed) {
                    console.log((0, utils_1.error)(`Unknown ${this.command} option.`));
                    command.help();
                }
            }
            catch (err) {
                console.log((0, utils_1.error)(err));
            }
        }));
    }
}
exports.Command = Command;
