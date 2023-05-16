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
exports.generateUser = void 0;
const { success } = require("../utils");
const { updateDockerComposeService } = require("./utils");
const randomString = require("randomstring");
const { GENERATED_USER_EMAIL } = require("../constants");
function generateUser(password, silent) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = GENERATED_USER_EMAIL;
        if (!password) {
            password = randomString.generate({ length: 6 });
        }
        updateDockerComposeService((service) => {
            service.environment["BB_ADMIN_USER_EMAIL"] = email;
            service.environment["BB_ADMIN_USER_PASSWORD"] = password;
        });
        if (!silent) {
            console.log(success(`User admin credentials configured, access with email: ${email} - password: ${password}`));
        }
    });
}
exports.generateUser = generateUser;
