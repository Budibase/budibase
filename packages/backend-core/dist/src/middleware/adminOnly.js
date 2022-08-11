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
module.exports = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.internal &&
        (!ctx.user || !ctx.user.admin || !ctx.user.admin.global)) {
        ctx.throw(403, "Admin user only endpoint.");
    }
    return next();
});
//# sourceMappingURL=adminOnly.js.map