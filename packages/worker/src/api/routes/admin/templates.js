const Router = require("@koa/router")
const controller = require("../../controllers/admin/templates")
// const joiValidator = require("../../../middleware/joi-validator")
// const Joi = require("joi")

const router = Router()

function buildTemplateSaveValidation() {}

router
  .post(
    "/api/admin/template/:type",
    buildTemplateSaveValidation(),
    controller.save
  )
  .get("/api/admin/template/:type", controller.fetch)
  .delete("/api/admin/template/:type/:id", controller.destroy)
  .get("/api/admin/template/:type/:id", controller.find)
