#!/usr/bin/env node
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
process.env.DISABLE_PINO_LOGGER = "1";
require("./prebuilds");
require("./environment");
const options_1 = require("./options");
const commander_1 = require("commander");
const utils_1 = require("./utils");
const package_json_1 = require("../package.json");
// add hosting config
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const program = new commander_1.Command()
            .addHelpCommand("help", (0, utils_1.getHelpDescription)("Help with Budibase commands."))
            .helpOption(false)
            .version(package_json_1.version);
        // add commands
        for (let command of (0, options_1.getCommands)()) {
            command.configure(program);
        }
        // this will stop the program if no command found
        yield program.parseAsync(process.argv);
    });
}
init().catch(err => {
    console.error(`Unexpected error - `, err);
});
