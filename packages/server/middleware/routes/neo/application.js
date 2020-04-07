const Router = require("@koa/router");
const controller = require("../../controllers/application");

const router = Router();

router.post("/api/:clientId/applications", controller.create)

module.exports = router;