import * as controller from "../controllers/webhook"
import { webhookValidator } from "./utils/validators"
import { builderRoutes, publicRoutes } from "./endpointGroups"
import koaBody from "koa-body"

builderRoutes
  .get("/api/webhooks", controller.fetch)
  .put("/api/webhooks", webhookValidator(), controller.save)
  .delete("/api/webhooks/:id/:rev", controller.destroy)
  .post("/api/webhooks/schema/:instance/:id", controller.buildSchema)

// this shouldn't have authorisation, right now its always public
publicRoutes.post("/api/webhooks/trigger/:instance/:id", controller.trigger)

const discordWebhookBodyParser = koaBody({
  multipart: true,
  // @ts-expect-error
  enableTypes: ["json", "form", "text"],
  parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  includeUnparsed: true,
})

publicRoutes.post(
  "/api/webhooks/discord/:instance/:chatAppId/:agentId",
  discordWebhookBodyParser,
  controller.discord
)
