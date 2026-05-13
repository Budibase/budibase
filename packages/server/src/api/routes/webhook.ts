import * as controller from "../controllers/webhook"
import { webhookValidator } from "./utils/validators"
import { builderRoutes, publicRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/webhooks", controller.fetch)
  .put("/api/webhooks", webhookValidator(), controller.save)
  .delete("/api/webhooks/:id/:rev", controller.destroy)
  .post("/api/webhooks/schema/:instance/:id", controller.buildSchema)

// this shouldn't have authorisation, right now its always public
publicRoutes.post("/api/webhooks/trigger/:instance/:id", controller.trigger)

publicRoutes.post(
  "/api/webhooks/discord/:instance/:chatAppId/:agentId",
  controller.discord
)

publicRoutes.post(
  "/api/webhooks/ms-teams/:instance/:chatAppId/:agentId",
  controller.MSTeams
)

publicRoutes.post(
  "/api/webhooks/slack/:instance/:chatAppId/:agentId",
  controller.slack
)

publicRoutes.post(
  "/api/webhooks/telegram/:instance/:chatAppId/:agentId",
  controller.telegram
)
