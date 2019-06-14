const Router = require("koa-router");
const session = require("./session");
const StatusCodes = require("../utilities/statusCodes");
module.exports = (config, app) => {

    var router = new Router();
    router.prefix("/:appname/api");

    router
    .post("/authenticate", async (ctx, next) => {
        const user = await ctx.master.authenticate(
            ctx.session._sessCtx.externalKey,
            ctx.params.appname,
            ctx.request.body.username,
            ctx.request.body.password
        );
        if(!user) {
            ctx.throw(StatusCodes.UNAUTHORIZED, "invalid username or password");
        } 
        next();
    })
    .post("/setPasswordFromTemporaryCode", async (ctx) => {

    })
    .post("/executeAction/:actionname", async (ctx) => {

    })
    .post("/createUser", async (ctx) => {

    })
    .post("/enableUser", async (ctx) => {

    })
    .post("/disableUser", async (ctx) => {

    })
    .get("/users", async (ctx) => {

    })
    .get("/accessLevels", async (ctx) => {

    })
    .post("/changeMyPassword", async (ctx) => {

    })
    .post("/listRecords/:indexkey", async (ctx) => {

    })
    .post("/aggregated/:indexkey", async (ctx) => {

    })
    .post("/record/:recordkey", async (ctx) => {

    })
    .get("/record/:recordkey", async (ctx) => {

    })
    .del("/record/:recordkey", async (ctx) => {

    })
    .post("/appHeirarchy", async (ctx) => {

    })
    .post("/actionsAndTriggers", async (ctx) => {

    })
    .post("/appDefinition", async (ctx) => {

    });

    router.use(session(config, app));

    return router;
}

/*
front end get authenticateTemporaryAccess {}
*/
