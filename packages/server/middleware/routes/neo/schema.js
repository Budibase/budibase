const Router = require("@koa/router");
const StatusCodes = require("../../utilities/statusCodes")
const routeHandlers = require("../routeHandlers")

const controller = require("../../controllers/schema");

const router = Router();

router.get("api/schema/:appId", controller.fetch);

router.post("api/schema/:appId", controller.save)

router.delete("api/schema/:appId", controller.delete)