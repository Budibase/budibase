const Router = require("@koa/router")
const authController = require("../controllers/auth")

const router = Router()

router
  .post("/api/admin/auth", authController.authenticate)
  .get("/api/admin/auth/google", authController.googlePreAuth)
  .get("/api/admin/auth/google/callback", authController.googleAuth)
  .post("/api/admin/auth/logout", authController.logout)

module.exports = router
