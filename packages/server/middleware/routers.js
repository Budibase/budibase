const Router = require("@koa/router");
const session = require("./session");
const StatusCodes = require("../utilities/statusCodes");
const fs = require("fs");
const { resolve } = require("path");
const send = require('koa-send');
const { getPackageForBuilder, 
    savePackage, getApps } = require("../utilities/builder");

const builderPath = resolve(__dirname, "../builder");

module.exports = (config, app) => {

    const router = new Router();

    const prependSlash = path => 
        path.startsWith("/")
        ? path
        : `/${path}`;

    router
    .use(session(config, app))
    .use(async (ctx, next) => {
        ctx.sessionId = ctx.session._sessCtx.externalKey;
        ctx.session.accessed = true;
        await next();
    })
    .get("/_builder", async (ctx) => {
        if(!config.dev) {
            ctx.request.status = StatusCodes.FORBIDDEN;
            ctx.request.body = "run in dev mode to access builder";
            return;
        }

        await send(ctx, "/index.html", { root: builderPath });

    })
    .get("/_builder/*", async (ctx, next) => {
        if(!config.dev) {
            ctx.request.status = StatusCodes.FORBIDDEN;
            ctx.request.body = "run in dev mode to access builder";
            return;
        }

        const path = ctx.path.replace("/_builder", "");

        if(path.startsWith("/api/")) {
            await next();
            return;
        }

        await send(ctx, path, { root: builderPath });

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
        const instanceApi = await ctx.master.getFullAccessInstanceApiForUsername(
            ctx.params.appname,
            ctx.request.body.username
        );

        if(!instanceApi) {
            ctx.request.status = StatusCodes.OK;
            return;
        }

        await instanceApi.authApi.setPasswordFromTemporaryCode(
            ctx.request.body.tempCode,
            ctx.request.body.newPassword); 

        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/createTemporaryAccess", async (ctx) => {
        const instanceApi = await ctx.master.getFullAccessInstanceApiForUsername(
            ctx.params.appname,
            ctx.request.body.username
        );

        if(!instanceApi) {
            ctx.request.status = StatusCodes.OK;
            return;
        }

        await instanceApi.authApi.createTemporaryAccess(
            ctx.request.body.username);
        
        ctx.response.status = StatusCodes.OK;
    })
    .get("/_builder/api/apps", async (ctx) => {
        if(!config.dev) {
            ctx.request.status = StatusCodes.FORBIDDEN;
            ctx.request.body = "run in dev mode to access builder";
            return;
        }

        ctx.body = await getApps(config);
        ctx.response.status = StatusCodes.OK;

    })
    .get("/_builder/api/:appname/appPackage", async (ctx) => {
        if(!config.dev) {
            ctx.request.status = StatusCodes.FORBIDDEN;
            ctx.request.body = "run in dev mode to access builder";
            return;
        }

        ctx.body = await getPackageForBuilder(
            config, 
            ctx.params.appname);
        ctx.response.status = StatusCodes.OK;

    })
    .post("/_builder/api/:appname/appPackage", async (ctx) => {
        if(!config.dev) {
            ctx.request.status = StatusCodes.FORBIDDEN;
            ctx.body = "run in dev mode to access builder";
            return;
        }

        ctx.body = await savePackage(
            config, 
            ctx.params.appname,
            ctx.request.body);
        ctx.response.status = StatusCodes.OK;
    })
    .use(async (ctx, next) => {

        const pathParts = ctx.path.split("/");

        if(pathParts.length < 2) {
            ctx.throw(StatusCodes.NOT_FOUND, "App Name not declared");
        }

        ctx.instance = await ctx.master.getInstanceApiForSession(
            pathParts[1],
            ctx.sessionId);

        if(ctx.instance === null) {
            ctx.response.status = StatusCodes.UNAUTHORIZED;
        } else {
            await next();
        }
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

        await ctx.master.removeSessionsForUser(
            ctx.params.appname,
            ctx.request.body.username
        );
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
    .post("/:appname/api/files/*", async (ctx) => {
        const file = ctx.request.files.file;
        ctx.body = await ctx.instance.recordApi.uploadFile(
            getRecordKey(ctx.params.appname, ctx.request.path),
            fs.createReadStream(file.path),
            file.name
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/record/*", async (ctx) => {
        ctx.body = await ctx.instance.recordApi.save(
            ctx.request.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/lookup_field/*", async (ctx) => {
        const recordKey = getRecordKey(ctx.params.appname, ctx.request.path)
        const fields = ctx.query.fields.split(",")
        const recordContext = await ctx.instance.recordApi.getContext(
            recordKey
        );
        const allContext = [];
        for(let field of fields) {
            allContext.push(
                await recordContext.referenceOptions(field)
            );
        }
        ctx.body = allContext;
        ctx.response.status = StatusCodes.OK;
    })
    .get("/:appname/api/record/*", async (ctx) => {
        try {
            ctx.body = await ctx.instance.recordApi.load(
                getRecordKey(ctx.params.appname, ctx.request.path)
            );
            ctx.response.status = StatusCodes.OK;
        } catch(e) {
            // need to be catching for 404s here
            ctx.response.status = StatusCodes.INTERAL_ERROR;
            ctx.response.body = e.message;
        }
    })
    .del("/:appname/api/record/*", async (ctx) => {
        await ctx.instance.recordApi.delete(
            getRecordKey(ctx.params.appname, ctx.request.path)
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/apphierarchy", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveApplicationHierarchy(
            ctx.body
        );
        ctx.response.status = StatusCodes.OK;
    })
    .post("/:appname/api/actionsAndTriggers", async (ctx) => {
        ctx.body = await ctx.instance.templateApi.saveApplicationHierarchy(
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

    const getRecordKey = (appname, wholePath) => 
        wholePath
        .replace(`/${appname}/api/files/`, "")
        .replace(`/${appname}/api/lookup_field/`, "")
        .replace(`/${appname}/api/record/`, "");

    return router;
}

/*
front end get authenticateTemporaryAccess {}
*/
