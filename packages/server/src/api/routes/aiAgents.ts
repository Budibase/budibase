import { auth } from "@budibase/backend-core"
import { aiRagEnabled } from "../../middleware/aiRagEnabled"
import * as ai from "../controllers/ai"
import {
  builderAdminRoutes,
  endpointGroupList,
  publicRoutes,
} from "./endpointGroups"
import {
  connectAgentSharePointSiteValidator,
  createAgentValidator,
  provisionAgentSlackChannelValidator,
  provisionAgentMSTeamsChannelValidator,
  syncAgentDiscordCommandsValidator,
  syncAgentKnowledgeSourcesValidator,
  toggleAgentDiscordDeploymentValidator,
  toggleAgentMSTeamsDeploymentValidator,
  toggleAgentSlackDeploymentValidator,
  updateAgentSharePointSiteValidator,
  updateAgentValidator,
} from "./utils/validators/agent"

builderAdminRoutes
  .get("/api/agent", ai.fetchAgents)
  .post("/api/agent", createAgentValidator(), ai.createAgent)
  .put("/api/agent", updateAgentValidator(), ai.updateAgent)
  .post("/api/agent/:agentId/duplicate", ai.duplicateAgent)
  .delete("/api/agent/:agentId", ai.deleteAgent)
  .post(
    "/api/agent/:agentId/discord/sync",
    syncAgentDiscordCommandsValidator(),
    ai.syncAgentDiscordCommands
  )
  .post(
    "/api/agent/:agentId/discord/toggle",
    toggleAgentDiscordDeploymentValidator(),
    ai.toggleAgentDiscordDeployment
  )
  .post(
    "/api/agent/:agentId/ms-teams/provision",
    provisionAgentMSTeamsChannelValidator(),
    ai.provisionAgentMSTeamsChannel
  )
  .post(
    "/api/agent/:agentId/ms-teams/toggle",
    toggleAgentMSTeamsDeploymentValidator(),
    ai.toggleAgentMSTeamsDeployment
  )
  .post(
    "/api/agent/:agentId/slack/toggle",
    toggleAgentSlackDeploymentValidator(),
    ai.toggleAgentSlackDeployment
  )
  .post(
    "/api/agent/:agentId/slack/provision",
    provisionAgentSlackChannelValidator(),
    ai.provisionAgentSlackChannel
  )
  .get("/api/agent/tools", ai.fetchTools)
  .get("/api/agent/:agentId/logs", ai.fetchAgentLogs)
  .get("/api/agent/:agentId/logs/session", ai.fetchAgentLogSession)
  .get("/api/agent/:agentId/logs/:requestId", ai.fetchAgentLogDetail)

const aiRagBuilderAdminRoutes = endpointGroupList
  .group(auth.builderOrAdmin)
  .addGroupMiddleware(aiRagEnabled)

aiRagBuilderAdminRoutes
  .get(
    "/api/agent/knowledge-sources/sharepoint/connect",
    ai.startSharePointAuth
  )
  .get("/api/agent/:agentId/knowledge", ai.fetchAgentKnowledge)
  .post("/api/agent/:agentId/files", ai.uploadAgentFile)
  .delete("/api/agent/:agentId/files/:fileId", ai.deleteAgentFile)
  .get(
    "/api/agent/:agentId/knowledge-sources/options",
    ai.fetchAgentKnowledgeSourceOptions
  )
  .get(
    "/api/agent/:agentId/knowledge-sources/sharepoint/entries/all",
    ai.fetchAgentKnowledgeSourceAllEntries
  )
  .post(
    "/api/agent/:agentId/knowledge-sources/sharepoint/sites",
    connectAgentSharePointSiteValidator(),
    ai.connectAgentSharePointSite
  )
  .patch(
    "/api/agent/:agentId/knowledge-sources/sharepoint/sites/:siteId",
    updateAgentSharePointSiteValidator(),
    ai.updateAgentSharePointSite
  )
  .delete(
    "/api/agent/:agentId/knowledge-sources/sharepoint/sites/:siteId",
    ai.disconnectAgentSharePointSite
  )
  .post(
    "/api/agent/:agentId/knowledge-sources/:sourceId/sync",
    syncAgentKnowledgeSourcesValidator(),
    ai.syncAgentKnowledgeSource
  )

publicRoutes.get(
  "/api/agent/knowledge-sources/sharepoint/callback",
  ai.completeSharePointAuth
)
