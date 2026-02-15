import Router from "@koa/router"
import { middleware as proMiddleware } from "@budibase/pro"
import { Feature } from "@budibase/types"
import * as userController from "../../controllers/global/scim/users"
import * as groupController from "../../controllers/global/scim/groups"

const router: Router = new Router({
  prefix: "/api/global/scim/v2",
})

router.use(proMiddleware.requireSCIM)
router.use(proMiddleware.doInScimContext)

router.get("/users", userController.get)
router.get("/users/:id", proMiddleware.scimUserOnly("id"), userController.find)
router.post("/users", userController.create)
router.patch(
  "/users/:id",
  proMiddleware.scimUserOnly("id"),
  userController.update
)
router.delete(
  "/users/:id",
  proMiddleware.scimUserOnly("id"),
  userController.remove
)

router.get("/groups", groupController.get)
router.post(
  "/groups",
  proMiddleware.feature.requireFeature(Feature.USER_GROUPS),
  groupController.create
)
router.get(
  "/groups/:id",
  proMiddleware.feature.requireFeature(Feature.USER_GROUPS),
  proMiddleware.scimGroupOnly("id"),
  groupController.find
)
router.delete(
  "/groups/:id",
  proMiddleware.feature.requireFeature(Feature.USER_GROUPS),
  proMiddleware.scimGroupOnly("id"),
  groupController.remove
)
router.patch(
  "/groups/:id",
  proMiddleware.feature.requireFeature(Feature.USER_GROUPS),
  proMiddleware.scimGroupOnly("id"),
  groupController.update
)

export default router
