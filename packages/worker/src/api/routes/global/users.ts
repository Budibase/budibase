import * as controller from "../../controllers/global/users"
import { auth } from "@budibase/backend-core"
import Joi from "joi"
import { users } from "../validation"
import {
  loggedInRoutes,
  cloudRestrictedRoutes,
  builderOrAdminRoutes,
  adminRoutes,
} from "../endpointGroups"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

function buildAdminInitValidation() {
  return auth.joiValidator.body(
    Joi.object({
      email: Joi.string().required(),
      password: OPTIONAL_STRING,
      tenantId: Joi.string().required(),
      ssoId: Joi.string(),
      familyName: OPTIONAL_STRING,
      givenName: OPTIONAL_STRING,
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

function buildChangeTenantOwnerEmailValidation() {
  return auth.joiValidator.body(
    Joi.object({
      newAccountEmail: Joi.string().required(),
      originalEmail: Joi.string().required(),
      tenantIds: Joi.array().items(Joi.string()).required(),
    }).required()
  )
}

cloudRestrictedRoutes
  .post(
    "/api/global/users/sso",
    users.buildAddSsoSupport(),
    controller.addSsoSupport
  )
  .post(
    "/api/global/users/init",
    buildAdminInitValidation(),
    controller.adminUser
  )
  .put(
    "/api/global/users/tenant/owner",
    buildChangeTenantOwnerEmailValidation(),
    controller.changeTenantOwnerEmail
  )

adminRoutes
  .post(
    "/api/global/users/bulk",
    users.buildUserBulkUserValidation(),
    controller.bulkUpdate
  )
  .delete("/api/global/users/:id", controller.destroy)

builderOrAdminRoutes
  .get("/api/global/users", controller.fetch)
  .get("/api/global/users/count/:appId", controller.countByApp)
  .post("/api/global/users/invite", buildInviteValidation(), controller.invite)
  .post(
    "/api/global/users/onboard",
    buildInviteMultipleValidation(),
    controller.onboardUsers
  )
  .post(
    "/api/global/users/multi/invite",
    buildInviteMultipleValidation(),
    controller.inviteMultiple
  )
  .post(
    "/api/global/users/multi/invite/delete",
    controller.removeMultipleInvites
  )
  .post("/api/global/users/invite/update/:code", controller.updateInvite)
  .get("/api/global/users/invites", controller.getUserInvites)
  .get("/api/global/users/:id", controller.find)

loggedInRoutes
  // search can be used by any user now, to retrieve users for user column
  .post("/api/global/users/search", controller.search)
  .post(
    "/api/global/users",
    createUserAdminOnly,
    users.buildUserSaveValidation(),
    controller.save
  )
  // non-global endpoints
  .get("/api/global/users/invite/:code", controller.checkInvite)
  .post(
    "/api/global/users/invite/accept",
    buildInviteAcceptValidation(),
    controller.inviteAccept
  )
  .get("/api/global/users/accountholder", controller.accountHolderLookup)
  .get("/api/global/users/tenant/:id", controller.tenantUserLookup)
