import Router from "@koa/router"
import * as controller from "../../controllers/global/templates"
import { TemplatePurpose, TemplateType } from "../../../constants"
import { auth as authCore } from "@budibase/backend-core"
import Joi from "joi"
const { adminOnly, joiValidator } = authCore

const router: Router = new Router()

function buildTemplateSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().allow(null, ""),
    _rev: Joi.string().allow(null, ""),
    ownerId: Joi.string().allow(null, ""),
    name: Joi.string().allow(null, ""),
    contents: Joi.string().required(),
    purpose: Joi.string().required().valid(...Object.values(TemplatePurpose)),
    type: Joi.string().required().valid(...Object.values(TemplateType)),
  }).required().unknown(true).optional())
}

router
  .get("/api/global/template/definitions", controller.definitions)
  .post(
    "/api/global/template",
    adminOnly,
    buildTemplateSaveValidation(),
    controller.save
  )
  .get("/api/global/template", controller.fetch)
  .get("/api/global/template/:type", controller.fetchByType)
  .get("/api/global/template/:ownerId", controller.fetchByOwner)
  .get("/api/global/template/:id", controller.find)
  .delete("/api/global/template/:id/:rev", adminOnly, controller.destroy)

export default router
