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
const { Client, utils } = require("@budibase/backend-core/redis");
const { newid } = require("@budibase/backend-core/utils");
function getExpirySecondsForDB(db) {
    switch (db) {
        case utils.Databases.PW_RESETS:
            // a hour
            return 3600;
        case utils.Databases.INVITATIONS:
            // a day
            return 86400;
    }
}
let pwResetClient, invitationClient;
function getClient(db) {
    switch (db) {
        case utils.Databases.PW_RESETS:
            return pwResetClient;
        case utils.Databases.INVITATIONS:
            return invitationClient;
    }
}
function writeACode(db, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield getClient(db);
        const code = newid();
        yield client.store(code, value, getExpirySecondsForDB(db));
        return code;
    });
}
function getACode(db, code, deleteCode = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield getClient(db);
        const value = yield client.get(code);
        if (!value) {
            throw "Invalid code.";
        }
        if (deleteCode) {
            yield client.delete(code);
        }
        return value;
    });
}
exports.init = () => __awaiter(void 0, void 0, void 0, function* () {
    pwResetClient = new Client(utils.Databases.PW_RESETS);
    invitationClient = new Client(utils.Databases.INVITATIONS);
    yield pwResetClient.init();
    yield invitationClient.init();
});
/**
 * make sure redis connection is closed.
 */
exports.shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    if (pwResetClient)
        yield pwResetClient.finish();
    if (invitationClient)
        yield invitationClient.finish();
});
/**
 * Given a user ID this will store a code (that is returned) for an hour in redis.
 * The user can then return this code for resetting their password (through their reset link).
 * @param {string} userId the ID of the user which is to be reset.
 * @param {object} info Info about the user/the reset process.
 * @return {Promise<string>} returns the code that was stored to redis.
 */
exports.getResetPasswordCode = (userId, info) => __awaiter(void 0, void 0, void 0, function* () {
    return writeACode(utils.Databases.PW_RESETS, { userId, info });
});
/**
 * Given a reset code this will lookup to redis, check if the code is valid and delete if required.
 * @param {string} resetCode The code provided via the email link.
 * @param {boolean} deleteCode If the code is used/finished with this will delete it - defaults to true.
 * @return {Promise<string>} returns the user ID if it is found
 */
exports.checkResetPasswordCode = (resetCode, deleteCode = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return getACode(utils.Databases.PW_RESETS, resetCode, deleteCode);
    }
    catch (err) {
        throw "Provided information is not valid, cannot reset password - please try again.";
    }
});
/**
 * Generates an invitation code and writes it to redis - which can later be checked for user creation.
 * @param {string} email the email address which the code is being sent to (for use later).
 * @param {object|null} info Information to be carried along with the invitation.
 * @return {Promise<string>} returns the code that was stored to redis.
 */
exports.getInviteCode = (email, info) => __awaiter(void 0, void 0, void 0, function* () {
    return writeACode(utils.Databases.INVITATIONS, { email, info });
});
/**
 * Checks that the provided invite code is valid - will return the email address of user that was invited.
 * @param {string} inviteCode the invite code that was provided as part of the link.
 * @param {boolean} deleteCode whether or not the code should be deleted after retrieval - defaults to true.
 * @return {Promise<object>} If the code is valid then an email address will be returned.
 */
exports.checkInviteCode = (inviteCode, deleteCode = true) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return getACode(utils.Databases.INVITATIONS, inviteCode, deleteCode);
    }
    catch (err) {
        throw "Invitation is not valid or has expired, please request a new one.";
    }
});
