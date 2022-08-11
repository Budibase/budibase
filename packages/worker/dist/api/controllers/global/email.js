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
const { sendEmail } = require("../../../utilities/email");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
exports.sendEmail = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { workspaceId, email, userId, purpose, contents, from, subject, automation, } = ctx.request.body;
    let user;
    if (userId) {
        const db = getGlobalDB();
        user = yield db.get(userId);
    }
    const response = yield sendEmail(email, purpose, {
        workspaceId,
        user,
        contents,
        from,
        subject,
        automation,
    });
    ctx.body = Object.assign(Object.assign({}, response), { message: `Email sent to ${email}.` });
});
