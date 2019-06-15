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
    .post("/:appname/api/createTemporaryAccess", async (ctx) => {
        
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
    .post("/:appname/api/changeMyPassword", async (ctx) => {
        await ctx.instance.authApi.changeMyPassword(
            ctx.request.body.currentPassword,
            ctx.request.body.newPassword
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/changeMyPassword", async (ctx) => {
        await ctx.instance.authApi.changeMyPassword(
            ctx.request.body.currentPassword,
            ctx.request.body.newPassword
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/executeAction/:actionname", async (ctx) => {
        ctx.body = await ctx.instance.actionApi.execute(
            ctx.request.body.actionname,
            ctx.request.body.parameters);
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/createUser", async (ctx) => {
        await ctx.instance.authApi.createUser(
            ctx.request.body.user,
            ctx.request.body.password
        );

        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/enableUser", async (ctx) => {
        await ctx.instance.authApi.enableUser(
            ctx.request.body.username);
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/disableUser", async (ctx) => {
        await ctx.instance.authApi.disableUser(
            ctx.request.body.username);
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/users", async (ctx) => {
        ctx.body = await ctx.instance.authApi.getUsers();
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/accessLevels", async (ctx) => {
        ctx.body = await ctx.instance.authApi.getAccessLevels();
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/listRecords/:indexkey", async (ctx) => {
        ctx.body = await ctx.instance.indexApi.listItems(
            ctx.request.body.indexKey,
            {
                rangeStartParams:ctx.request.body.rangeStartParams, 
                rangeEndParams:ctx.request.body.rangeEndParams, 
                searchPhrase:ctx.request.body.searchPhrase
            }
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/aggregates/:indexkey", async (ctx) => {
        ctx.body = await ctx.instance.indexApi.aggregates(
            ctx.request.body.indexKey,
            {
                rangeStartParams:ctx.request.body.rangeStartParams, 
                rangeEndParams:ctx.request.body.rangeEndParams, 
                searchPhrase:ctx.request.body.searchPhrase
            }
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/record/:recordkey", async (ctx) => {
        ctx.body = await ctx.instance.recordApi.save(
            ctx.request.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/record/:recordkey", async (ctx) => {
        ctx.body = await ctx.instance.recordApi.load(
            ctx.params.recordKey
        );
        ctx.response.status = StatusCodes.OK;
    })
    .del("/:appname/api/record/:recordkey", async (ctx) => {
        await ctx.instance.recordApi.delete(
            ctx.params.recordKey
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/appHeirarchy", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveApplicationHeirarchy(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/actionsAndTriggers", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveApplicationHeirarchy(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/appDefinition", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveActionsAndTriggers(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    });

    return router;
}

/*
front end get authenticateTemporaryAccess {}
*/
