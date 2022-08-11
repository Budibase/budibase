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
exports.fetchDefinitions = exports.runMigrations = void 0;
const { migrate, MIGRATIONS } = require("../../../migrations");
const runMigrations = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const options = ctx.request.body;
    // don't await as can take a while, just return
    migrate(options);
    ctx.status = 200;
});
exports.runMigrations = runMigrations;
const fetchDefinitions = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = MIGRATIONS;
    ctx.status = 200;
});
exports.fetchDefinitions = fetchDefinitions;
