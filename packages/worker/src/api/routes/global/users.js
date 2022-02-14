const Router = require("@koa/router")
const controller = require("../../controllers/global/users")
const joiValidator = require("../../../middleware/joi-validator")
const adminOnly = require("../../../middleware/adminOnly")
const Joi = require("joi")
const cloudRestricted = require("../../../middleware/cloudRestricted")
const { buildUserSaveValidation } = require("../../utilities/validation")
const selfController = require("../../controllers/global/self")

const router = Router()

function buildAdminInitValidation() {
  return joiValidator.body(
    Joi.object({
      email: Joi.string().required(),
      password: Joi.string(),
      tenantId: Joi.string().required(),
    })
      .required()
      .unknown(false)
  )
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
    "/api/global/users/invite/accept",
    buildInviteAcceptValidation(),
    controller.inviteAccept
  )
  .post(
    "/api/global/users/init",
    cloudRestricted,
    buildAdminInitValidation(),
    controller.adminUser
  )
  .get("/api/global/users/tenant/:id", controller.tenantUserLookup)
  // global endpoint but needs to come at end (blocks other endpoints otherwise)
  .get("/api/global/users/:id", adminOnly, controller.find)
  // DEPRECATED - use new versions with self API
  .get("/api/global/users/self", selfController.getSelf)
  .post(
    "/api/global/users/self",
    buildUserSaveValidation(true),
    selfController.updateSelf
  )

module.exports = router
