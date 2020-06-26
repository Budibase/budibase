const Router = require("@koa/router")
const controller = require("../controllers/user")
const authorized = require("../../middleware/authorized")
const { USER_MANAGEMENT, LIST_USERS } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/users", authorized(LIST_USERS), controller.fetch)
  .get("/api/users/:username", authorized(USER_MANAGEMENT), controller.find)
  .put("/api/users/", authorized(USER_MANAGEMENT), controller.update)
  .post("/api/users", authorized(USER_MANAGEMENT), controller.create)
  .delete(
    "/api/users/:username",
    authorized(USER_MANAGEMENT),
    controller.destroy
  )

module.exports = router
