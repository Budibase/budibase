const Router = require("@koa/router")
const controller = require("../../controllers/admin/users")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")

const router = Router()

function buildUserSaveValidation(isSelf = false) {
  let schema = {
    email: Joi.string().allow(null, ""),
    password: Joi.string().allow(null, ""),
    firstName: Joi.string().allow(null, ""),
    lastName: Joi.string().allow(null, ""),
    builder: Joi.object({
      global: Joi.boolean().optional(),
      apps: Joi.array().optional(),
    }).unknown(true).optional(),
    // maps appId -> roleId for the user
    roles: Joi.object()
      .pattern(/.*/, Joi.string())
      .required()
      .unknown(true)
  }
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  return joiValidator.body(Joi.object(schema)
    .required()
    .unknown(true))
}

function buildInviteValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    email: Joi.string().required(),
  }).required())
}

function buildInviteAcceptValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    inviteCode: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(true))
}

function buildUpdateSelfValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    inviteCode: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(true))
}

router
  .post("/api/admin/users", buildUserSaveValidation(), controller.save)
  .get("/api/admin/users", controller.fetch)
  .post("/api/admin/users/init", controller.adminUser)
  .get("/api/admin/users/self", controller.getSelf)
  .post("/api/admin/users/self", buildUserSaveValidation(true), controller.updateSelf)
  .delete("/api/admin/users/:id", controller.destroy)
  .get("/api/admin/users/:id", controller.find)
  .get("/api/admin/roles/:appId")
  .post("/api/admin/users/invite", buildInviteValidation(), controller.invite)
  .post(
    "/api/admin/users/invite/accept",
    buildInviteAcceptValidation(),
    controller.inviteAccept
  )

module.exports = router
