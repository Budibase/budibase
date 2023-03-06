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
const Command_1 = require("../structures/Command");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const Client_1 = require("./Client");
const client = new Client_1.AnalyticsClient();
function optOut() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // opt them out
            client.disable();
            console.log((0, utils_1.success)("Successfully opted out of Budibase analytics. You can opt in at any time by running 'budi analytics opt-in'"));
        }
        catch (err) {
            console.log((0, utils_1.error)(`Error opting out of Budibase analytics. Please try again later - ${err}`));
        }
    });
}
function optIn() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // opt them in
            client.enable();
            console.log((0, utils_1.success)("Successfully opted in to Budibase analytics. Thank you for helping us make Budibase better!"));
        }
        catch (err) {
            console.log((0, utils_1.error)("Error opting in to Budibase analytics. Please try again later."));
        }
    });
}
function status() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log((0, utils_1.success)(`Budibase analytics ${client.status()}`));
        }
        catch (err) {
            console.log((0, utils_1.error)("Error fetching analytics status. Please try again later."));
        }
    });
}
exports.default = new Command_1.Command(`${constants_1.CommandWord.ANALYTICS}`)
    .addHelp("Control the analytics you send to Budibase.")
    .addSubOption("--optin", "Opt in to sending analytics to Budibase", optIn)
    .addSubOption("--optout", "Opt out of sending analytics to Budibase.", optOut)
    .addSubOption("--status", "Check whether you are currently opted in to Budibase analytics.", status);
