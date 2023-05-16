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
exports.number = exports.string = exports.confirmation = void 0;
const inquirer = require("inquirer");
function confirmation(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            type: "confirm",
            message: question,
            default: true,
            name: "confirmation",
        };
        return (yield inquirer.prompt(config)).confirmation;
    });
}
exports.confirmation = confirmation;
function string(question, defaultString) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            type: "input",
            name: "string",
            message: question,
        };
        if (defaultString) {
            config.default = defaultString;
        }
        return (yield inquirer.prompt(config)).string;
    });
}
exports.string = string;
function number(question, defaultNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            type: "input",
            name: "number",
            message: question,
            validate: (value) => {
                let valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            },
            filter: Number,
        };
        if (defaultNumber) {
            config.default = defaultNumber;
        }
        return (yield inquirer.prompt(config)).number;
    });
}
exports.number = number;
