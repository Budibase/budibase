import * as controller from "../controllers/dev"
import env from "../../environment"
import { builderRoutes, publicRoutes } from "./endpointGroups"

function redirectPath(path: string) {
  publicRoutes
    .get(`/api/${path}/:devPath(.*)`, controller.buildRedirectGet(path))
    .post(`/api/${path}/:devPath(.*)`, controller.buildRedirectPost(path))
    .delete(`/api/${path}/:devPath(.*)`, controller.buildRedirectDelete(path))
}

if (env.isDev() || env.isTest()) {
  redirectPath("global")
  redirectPath("system")
}

builderRoutes
  .get("/api/dev/version", controller.getBudibaseVersion)
  .delete("/api/dev/:appId/lock", controller.clearLock)
  .post("/api/dev/:appId/revert", controller.revert)
