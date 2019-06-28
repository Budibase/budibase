const Koa = require('koa');
const app = new Koa();
const getMasterAppInternal = require("./utilities/masterAppInternal");
const router = require("./middleware/routers");
const koaBody = require('koa-body');
const initialiseRuntimePackages  = require("./initialise/initialiseRuntimePackages");

module.exports = async (config) => {

    app.keys = config.keys;
    app.context.master = await getMasterAppInternal(config);
    app.context.getAppPackage = await initialiseRuntimePackages(
        config,
        app.context.master,
        config.latestAppsPath
    )
    app.use(koaBody({ multipart : true }));
    app.use(router(config, app).routes());
    return app.listen();
};
