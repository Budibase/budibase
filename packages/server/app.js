const Koa = require('koa');
const app = new Koa();
const getMasterAppInternal = require("./utilities/masterAppInternal");
const router = require("./middleware/routers");
const bodyParser = require('koa-bodyparser');

module.exports = async (config) => {

    app.keys = config.keys;
    app.context.master = await getMasterAppInternal(config);

    app.use(router(config, app).routes);
    app.use(bodyParser());
    return app.listen();
};
