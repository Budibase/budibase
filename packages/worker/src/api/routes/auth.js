const Router = require("@koa/router")
const { passport } = require("@budibase/auth").auth
const authController = require("../controllers/auth")
const context = require("koa/lib/context")

const router = Router()

router
  .post("/api/admin/auth", authController.authenticate)
  .get(
    "/api/admin/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )
  .get("/api/admin/auth/google/callback", authController.googleAuth)
  .post("/api/admin/auth/logout", authController.logout)

module.exports = router
