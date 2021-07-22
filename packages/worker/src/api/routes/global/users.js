const Router = require("@koa/router")
const controller = require("../../controllers/global/users")
const joiValidator = require("../../../middleware/joi-validator")
const adminOnly = require("../../../middleware/adminOnly")
const Joi = require("joi")

const router = Router()

function buildAdminInitValidation() {
  return joiValidator.body(
    Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      tenantId: Joi.string().required(),
    })
      .required()
      .unknown(false)
  )
}

function buildUserSaveValidation(isSelf = false) {
  let schema = {
    email: Joi.string().allow(null, ""),
    password: Joi.string().allow(null, ""),
    forceResetPassword: Joi.boolean().optional(),
    firstName: Joi.string().allow(null, ""),
    lastName: Joi.string().allow(null, ""),
    builder: Joi.object({
      global: Joi.boolean().optional(),
      apps: Joi.array().optional(),
    })
      .unknown(true)
      .optional(),
    // maps appId -> roleId for the user
    roles: Joi.object().pattern(/.*/, Joi.string()).required().unknown(true),
  }
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  return joiValidator.body(Joi.object(schema).required().unknown(true))
}

function buildInviteValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    email: Joi.string().required(),
    userInfo: Joi.object().optional(),
  }).required())
}

function buildInviteAcceptValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    inviteCode: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(true))
}

router
  .post(
    "/api/global/users",
    adminOnly,
    buildUserSaveValidation(),
    controller.save
  )
  .get("/api/global/users", adminOnly, controller.fetch)
  .delete("/api/global/roles/:appId", adminOnly, controller.removeAppRole)
  .delete("/api/global/users/:id", adminOnly, controller.destroy)
  .get("/api/global/roles/:appId")
  .post(
    "/api/global/users/invite",
    adminOnly,
    buildInviteValidation(),
    controller.invite
  )
  // non-global endpoints
  .post(
    "/api/global/users/self",
    buildUserSaveValidation(true),
    controller.updateSelf
  )
  .post(
    "/api/global/users/invite/accept",
    buildInviteAcceptValidation(),
    controller.inviteAccept
  )
  .post(
    "/api/global/users/init",
    buildAdminInitValidation(),
    controller.adminUser
  )
  .get("/api/global/users/self", controller.getSelf)
  // global endpoint but needs to come at end (blocks other endpoints otherwise)
  .get("/api/global/users/:id", adminOnly, controller.find)

module.exports = router
