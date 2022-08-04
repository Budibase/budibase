const Router = require("@koa/router")
const controller = require("../../controllers/global/users")
const { joiValidator } = require("@budibase/backend-core/auth")
const { adminOnly } = require("@budibase/backend-core/auth")
const Joi = require("joi")
const cloudRestricted = require("../../../middleware/cloudRestricted")
const { users } = require("../validation")
const selfController = require("../../controllers/global/self")
const builderOrAdmin = require("../../../middleware/builderOrAdmin")

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

function buildInviteMultipleValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.array().required().items(
    Joi.object({
      email: Joi.string(),
      userInfo: Joi.object().optional(),
    })
  ))
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
    users.buildUserSaveValidation(),
    controller.save
  )
  .post(
    "/api/global/users/bulkCreate",
    adminOnly,
    users.buildUserBulkSaveValidation(),
    controller.bulkCreate
  )

  .get("/api/global/users", builderOrAdmin, controller.fetch)
  .post("/api/global/users/search", builderOrAdmin, controller.search)
  .delete("/api/global/users/:id", adminOnly, controller.destroy)
  .post("/api/global/users/bulkDelete", adminOnly, controller.bulkDelete)
  .get("/api/global/users/count/:appId", builderOrAdmin, controller.countByApp)
  .get("/api/global/roles/:appId")
  .post(
    "/api/global/users/invite",
    adminOnly,
    buildInviteValidation(),
    controller.invite
  )
  .post(
    "/api/global/users/invite",
    adminOnly,
    buildInviteValidation(),
    controller.invite
  )
  .post(
    "/api/global/users/multi/invite",
    adminOnly,
    buildInviteMultipleValidation(),
    controller.inviteMultiple
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
  .get("/api/global/users/:id", builderOrAdmin, controller.find)
  // DEPRECATED - use new versions with self API
  .get("/api/global/users/self", selfController.getSelf)
  .post(
    "/api/global/users/self",
    users.buildUserSaveValidation(true),
    selfController.updateSelf
  )

module.exports = router
