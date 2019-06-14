const Router = require("koa-router");
const session = require("./session");
const StatusCodes = require("../utilities/statusCodes");
module.exports = (config, app) => {

    const router = new Router();

    router
    /*.use(async (ctx) => {
        if(!await ctx.master.getApplication(ctx.params.appname)) {
            ctx.throw(StatusCodes.NOT_FOUND, `could not find app named ${ctx.params.appname}`);
        }
    })*/
    .use(session(config, app))
    .use(async (ctx, next) => {
        ctx.sessionId = ctx.session._sessCtx.externalKey;
        ctx.session.accessed = true;
        await next();
    })
    .get("/:appname", async (ctx) => {
        ctx.response.status = StatusCodes.OK;
        ctx.response.body = "UI Served Here";
    })
    .post("/:appname/api/authenticate", async (ctx, next) => {
        const user = await ctx.master.authenticate(
            ctx.sessionId,
            ctx.params.appname,
            ctx.request.body.username,
            ctx.request.body.password
        );
        if(!user) {
            ctx.throw(StatusCodes.UNAUTHORIZED, "invalid username or password");
        } 

        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/setPasswordFromTemporaryCode", async (ctx) => {

    })
    .use(async (ctx, next) => {

        const pathParts = ctx.path.split("/");

        if(pathParts.length < 2) {
            ctx.throw(StatusCodes.NOT_FOUND, "App Name not declared");
        }

        ctx.instance = await ctx.master.getInstanceApiForSession(
            pathParts[1],
            ctx.sessionId);

        await next();
    })
    .post("/:appname/api/executeAction/:actionname", async (ctx) => {

    })
    .post("/:appname/api/createUser", async (ctx) => {
        await ctx.instance.authApi.createUser(
            ctx.request.body.user,
            ctx.request.body.password
        );

        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/enableUser", async (ctx) => {

    })
    .post("/:appname/api/disableUser", async (ctx) => {

    })
    .get("/:appname/api/users", async (ctx) => {

    })
    .get("/:appname/api/accessLevels", async (ctx) => {

    })
    .post("/:appname/api/changeMyPassword", async (ctx) => {

    })
    .post("/:appname/api/listRecords/:indexkey", async (ctx) => {

    })
    .post("/:appname/api/aggregated/:indexkey", async (ctx) => {

    })
    .post("/:appname/api/record/:recordkey", async (ctx) => {

    })
    .get("/:appname/api/record/:recordkey", async (ctx) => {

    })
    .del("/:appname/api/record/:recordkey", async (ctx) => {

    })
    .post("/:appname/api/appHeirarchy", async (ctx) => {

    })
    .post("/:appname/api/actionsAndTriggers", async (ctx) => {

    })
    .post("/:appname/api/appDefinition", async (ctx) => {

    });

    return router;
}

/*
front end get authenticateTemporaryAccess {}
*/
