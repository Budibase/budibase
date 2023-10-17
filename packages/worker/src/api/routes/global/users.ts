import Router from "@koa/router"
import * as controller from "../../controllers/global/users"
import { auth } from "@budibase/backend-core"
import Joi from "joi"
import cloudRestricted from "../../../middleware/cloudRestricted"
import { users } from "../validation"
import * as selfController from "../../controllers/global/self"

const router: Router = new Router()

function buildAdminInitValidation() {
  return auth.joiValidator.body(
    Joi.object({
      email: Joi.string().required(),
      password: Joi.string(),
      tenantId: Joi.string().required(),
      ssoId: Joi.string(),
    })
      .required()
      .unknown(false)
  )
}

function buildInviteValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    email: Joi.string().required(),
    userInfo: Joi.object().optional(),
  }).required())
}

function buildInviteMultipleValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.array().required().items(
    Joi.object({
      email: Joi.string(),
      userInfo: Joi.object().optional(),
    })
  ))
}

const createUserAdminOnly = (ctx: any, next: any) => {
  if (!ctx.request.body._id) {
    return auth.adminOnly(ctx, next)
  } else {
    return auth.builderOrAdmin(ctx, next)
  }
}

function buildInviteAcceptValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    inviteCode: Joi.string().required(),
    password: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
  }).required().unknown(true))
}

router
  .post(
    "/api/global/users",
    createUserAdminOnly,
    users.buildUserSaveValidation(),
    controller.save
  )
  .post(
    "/api/global/users/bulk",
    auth.adminOnly,
    users.buildUserBulkUserValidation(),
    controller.bulkUpdate
  )

  .get("/api/global/users", auth.builderOrAdmin, controller.fetch)
  .post("/api/global/users/search", auth.builderOrAdmin, controller.search)
  .delete("/api/global/users/:id", auth.adminOnly, controller.destroy)
  .get(
    "/api/global/users/count/:appId",
    auth.builderOrAdmin,
    controller.countByApp
  )
  .get("/api/global/roles/:appId")
  .post(
    "/api/global/users/invite",
    auth.builderOrAdmin,
    buildInviteValidation(),
    controller.invite
  )
  .post(
    "/api/global/users/onboard",
    auth.builderOrAdmin,
    buildInviteMultipleValidation(),
    controller.onboardUsers
  )
  .post(
    "/api/global/users/multi/invite",
    auth.builderOrAdmin,
    buildInviteMultipleValidation(),
    controller.inviteMultiple
  )

  // non-global endpoints
  .get("/api/global/users/invite/:code", controller.checkInvite)
  .post(
    "/api/global/users/invite/update/:code",
    auth.builderOrAdmin,
    controller.updateInvite
  )
  .get(
    "/api/global/users/invites",
    auth.builderOrAdmin,
    controller.getUserInvites
  )
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
  .get("/api/global/users/:id", auth.builderOrAdmin, controller.find)
  // DEPRECATED - use new versions with self API
  .get("/api/global/users/self", selfController.getSelf)
  .post(
    "/api/global/users/self",
    users.buildUserSaveValidation(),
    selfController.updateSelf
  )

export default router
