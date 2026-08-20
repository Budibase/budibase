import * as controller from "../controllers/webhook"
import { webhookValidator } from "./utils/validators"
import { builderRoutes, publicRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/webhooks", controller.fetch)
  .put("/api/webhooks", webhookValidator(), controller.save)
  .delete("/api/webhooks/:id/:rev", controller.destroy)
  .post("/api/webhooks/schema/:instance/:id", controller.buildSchema)

publicRoutes.post(
  "/api/webhooks/schema/:instance/:id/:schemaToken",
  controller.buildSchemaWithToken
)

// this shouldn't have authorisation, right now its always public
publicRoutes.post("/api/webhooks/trigger/:instance/:id", controller.trigger)

publicRoutes.post(
  "/api/webhooks/ms-teams/:instance/:agentId",
  controller.MSTeams
)

publicRoutes.post("/api/webhooks/slack/:instance/:agentId", controller.slack)

// These URLs are registered in external Slack/Teams app configuration, which we
// can't update on upgrade, so deployments provisioned before the chat app was
// removed keep working. The extra segment is the old chat app ID and is ignored.
publicRoutes.post(
  "/api/webhooks/ms-teams/:instance/:legacyChatAppId/:agentId",
  controller.MSTeams
)

publicRoutes.post(
  "/api/webhooks/slack/:instance/:legacyChatAppId/:agentId",
  controller.slack
)
