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
const global_agent_1 = require("global-agent");
const env = require("./environment");
const db_1 = __importDefault(require("./db"));
db_1.default.init();
const Koa = require("koa");
const destroyable = require("server-destroy");
const koaBody = require("koa-body");
const koaSession = require("koa-session");
const { passport } = require("@budibase/backend-core/auth");
const { logAlert } = require("@budibase/backend-core/logging");
const logger = require("koa-pino-logger");
const http = require("http");
const api = require("./api");
const redis = require("./utilities/redis");
const Sentry = require("@sentry/node");
const backend_core_1 = require("@budibase/backend-core");
// this will setup http and https proxies form env variables
(0, global_agent_1.bootstrap)();
const app = new Koa();
app.keys = ["secret", "key"];
// set up top level koa middleware
app.use(koaBody({ multipart: true }));
app.use(koaSession(app));
app.use(logger((0, backend_core_1.pinoSettings)()));
// authentication
app.use(passport.initialize());
app.use(passport.session());
// api routes
app.use(api.routes());
// sentry
if (env.isProd()) {
    Sentry.init();
    app.on("error", (err, ctx) => {
        Sentry.withScope(function (scope) {
            scope.addEventProcessor(function (event) {
                return Sentry.Handlers.parseRequest(event, ctx.request);
            });
            Sentry.captureException(err);
        });
    });
}
const server = http.createServer(app.callback());
destroyable(server);
let shuttingDown = false, errCode = 0;
server.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;
    if (!env.isTest()) {
        console.log("Server Closed");
    }
    yield redis.shutdown();
    yield backend_core_1.events.shutdown();
    if (!env.isTest()) {
        process.exit(errCode);
    }
}));
const shutdown = () => {
    server.close();
    server.destroy();
};
module.exports = server.listen(parseInt(env.PORT || 4002), () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Worker running on ${JSON.stringify(server.address())}`);
    yield redis.init();
}));
process.on("uncaughtException", err => {
    errCode = -1;
    logAlert("Uncaught exception.", err);
    shutdown();
});
process.on("SIGTERM", () => {
    shutdown();
});
