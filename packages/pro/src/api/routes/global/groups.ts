import { auth } from "@budibase/backend-core"
import { Feature } from "@budibase/types"
import Router from "@koa/router"
import Joi from "joi"
import { feature, internalGroupOnly } from "../../../middleware"
import * as controller from "../../controllers/global/groups"

const router: Router = new Router()

function buildGroupSaveValidation() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().optional(),
      _rev: Joi.string().optional(),
      color: Joi.string().required(),
      icon: Joi.string().required(),
      name: Joi.string().trim().required().max(50),
      role: Joi.string().optional(),
      users: Joi.array().optional(),
      apps: Joi.array().optional(),
      roles: Joi.object().optional(),
      createdAt: Joi.string().optional(),
      updatedAt: Joi.string().optional(),
    }).required()
  )
}

router
  .post(
    "/api/global/groups",
    auth.adminOnly,
    feature.requireFeature(Feature.USER_GROUPS),
    buildGroupSaveValidation(),
    controller.save
  )
  .get(
    "/api/global/groups",
    feature.requireFeature(Feature.USER_GROUPS),
    controller.fetch
  )

  .delete(
    "/api/global/groups/:groupId/:rev",
    feature.requireFeature(Feature.USER_GROUPS),
    auth.adminOnly,
    internalGroupOnly("groupId"),
    controller.destroy
  )
  .get(
    "/api/global/groups/:groupId",
    feature.requireFeature(Feature.USER_GROUPS),
    auth.builderOrAdmin,
    controller.find
  )
  .get(
    "/api/global/groups/:groupId/users",
    feature.requireFeature(Feature.USER_GROUPS),
    auth.builderOrAdmin,
    controller.searchUsers
  )
  // these endpoints adjust existing groups
  .post(
    "/api/global/groups/:groupId/users",
    auth.adminOnly,
    feature.requireFeature(Feature.USER_GROUPS),
    internalGroupOnly("groupId"),
    controller.updateGroupUsers
  )
  .post(
    "/api/global/groups/:groupId/users/bulk",
    auth.adminOnly,
    feature.requireFeature(Feature.USER_GROUPS),
    internalGroupOnly("groupId"),
    auth.joiValidator.body(
      Joi.object({
        csvContent: Joi.string().required(),
      }).required()
    ),
    controller.bulkAddUsersFromCsv
  )
  .post(
    "/api/global/groups/:groupId/apps",
    auth.builderOrAdmin,
    feature.requireFeature(Feature.USER_GROUPS),
    controller.updateGroupApps
  )

export default router
