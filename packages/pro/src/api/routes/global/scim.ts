import Router from "@koa/router"
import {
  requireSCIM,
  doInScimContext,
  scimUserOnly,
  scimGroupOnly,
  feature,
} from "../../../middleware"

import * as userController from "../../controllers/global/scim/users"
import * as groupController from "../../controllers/global/scim/groups"
import { Feature } from "@budibase/types"

const router: Router = new Router({
  prefix: "/api/global/scim/v2",
})

router.use(requireSCIM)
router.use(doInScimContext)

router.get("/users", userController.get)
router.get("/users/:id", scimUserOnly("id"), userController.find)
router.post("/users", userController.create)
router.patch("/users/:id", scimUserOnly("id"), userController.update)
router.delete("/users/:id", scimUserOnly("id"), userController.remove)

router.get("/groups", groupController.get)
router.post(
  "/groups",
  feature.requireFeature(Feature.USER_GROUPS),
  groupController.create
)
router.get(
  "/groups/:id",
  feature.requireFeature(Feature.USER_GROUPS),
  scimGroupOnly("id"),
  groupController.find
)
router.delete(
  "/groups/:id",
  feature.requireFeature(Feature.USER_GROUPS),
  scimGroupOnly("id"),
  groupController.remove
)
router.patch(
  "/groups/:id",
  feature.requireFeature(Feature.USER_GROUPS),
  scimGroupOnly("id"),
  groupController.update
)

export default router
