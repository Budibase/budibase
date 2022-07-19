import { groups } from "@budibase/pro"
import Router from "@koa/router"
import joiValidator from "../../../middleware/joi-validator"
import adminOnly from "../../../middleware/adminOnly"
import Joi from "joi"

const router = new Router()

function buildGroupSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    color: Joi.string().required(),
    icon: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().optional(),
    users: Joi.array().optional(),
    apps: Joi.array().optional(),
    roles: Joi.object().optional(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
  }).required())
}

router
  .post(
    "/api/global/groups",
    adminOnly,
    buildGroupSaveValidation(),
    groups.save
  )
  .get("/api/global/groups", groups.fetch)
  .delete("/api/global/groups/:id/:rev", adminOnly, groups.destroy)
  .get("/api/global/groups/:id", adminOnly, groups.find)

module.exports = router
