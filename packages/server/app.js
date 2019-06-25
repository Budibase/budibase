const Koa = require('koa');
const app = new Koa();
const getMasterAppInternal = require("./utilities/masterAppInternal");
const router = require("./middleware/routers");
const bodyParser = require('koa-bodyparser');
const initialiseRuntimeApps = require("./initialise/initialiseRuntimePackages");

module.exports = async (config) => {

    app.keys = config.keys;
    app.context.master = await getMasterAppInternal(config);
    app.context.getAppPackage = await initialiseRuntimeApps(
        config,
        app.context.master,
        config.latestAppsPath
    )
    app.use(bodyParser());
    app.use(router(config, app).routes());
    return app.listen();
};
