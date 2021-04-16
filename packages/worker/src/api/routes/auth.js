const Router = require("@koa/router")
const { passport } = require("@budibase/auth")
const authController = require("../controllers/auth")

const router = Router()

router
  .post("/api/admin/auth", authController.authenticate)
  .post("/api/admin/auth/logout", authController.logout)
  .get("/api/auth/google", passport.authenticate("google"))
  .get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/app",
      failureRedirect: "/",
    })
  )

module.exports = router
