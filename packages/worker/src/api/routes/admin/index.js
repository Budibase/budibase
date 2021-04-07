const Router = require("@koa/router")
const passport = require("@budibase/auth")
const controller = require("../../controllers/admin")
const authController = require("../../controllers/admin/auth")

const router = Router()

router
  .post("/api/admin/users", passport.authenticate("jwt"), controller.userSave)
  .post("/api/admin/authenticate", authController.authenticate)
  .delete(
    "/api/admin/users/:email",
    passport.authenticate("jwt"),
    controller.userDelete
  )
  .get("/api/admin/users", passport.authenticate("jwt"), controller.userFetch)
  .get(
    "/api/admin/users/:email",
    passport.authenticate("jwt"),
    controller.userFind
  )

module.exports = router
