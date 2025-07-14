import * as controller from "../controllers/dev"
import env from "../../environment"
import { builderGroup, publicGroup } from "./endpointGroups"

function redirectPath(path: string) {
  publicGroup
    .get(`/api/${path}/:devPath(.*)`, controller.buildRedirectGet(path))
    .post(`/api/${path}/:devPath(.*)`, controller.buildRedirectPost(path))
    .delete(`/api/${path}/:devPath(.*)`, controller.buildRedirectDelete(path))
}

if (env.isDev() || env.isTest()) {
  redirectPath("global")
  redirectPath("system")
}

builderGroup
  .get("/api/dev/version", controller.getBudibaseVersion)
  .delete("/api/dev/:appId/lock", controller.clearLock)
  .post("/api/dev/:appId/revert", controller.revert)
