import { auth } from "@budibase/backend-core"
import { aiTestsEnabled } from "../../middleware/aiTestsEnabled"
import * as ai from "../controllers/ai"
import {
  builderAdminRoutes,
  endpointGroupList,
  publicRoutes,
} from "./endpointGroups"
import {
  connectAgentSharePointSiteValidator,
  createAgentSlackAppValidator,
  createAgentOperationValidator,
  createAgentValidator,
  provisionAgentSlackChannelValidator,
  provisionAgentTelegramChannelValidator,
  provisionAgentMSTeamsChannelValidator,
  syncAgentDiscordCommandsValidator,
  syncAgentKnowledgeSourcesValidator,
  toggleAgentDiscordDeploymentValidator,
  toggleAgentMSTeamsDeploymentValidator,
  toggleAgentSlackDeploymentValidator,
  runAgentTestSuiteValidator,
  toggleAgentTelegramDeploymentValidator,
  updateAgentSharePointSiteValidator,
  updateAgentOperationValidator,
  updateAgentTestSuiteValidator,
  updateAgentValidator,
} from "./utils/validators/agent"

builderAdminRoutes
  .get("/api/agent", ai.fetchAgents)
  .post("/api/agent", createAgentValidator(), ai.createAgent)
  .put("/api/agent", updateAgentValidator(), ai.updateAgent)
  .post(
    "/api/agent/:agentId/operations",
    createAgentOperationValidator(),
    ai.createAgentOperation
  )
  .put(
    "/api/agent/:agentId/operations/:operationId",
    updateAgentOperationValidator(),
    ai.updateAgentOperation
  )
  .delete(
    "/api/agent/:agentId/operations/:operationId",
    ai.deleteAgentOperation
  )
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
  .get("/api/agent/:agentId/ms-teams/package", ai.downloadAgentMSTeamsPackage)
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
  .post(
    "/api/agent/:agentId/slack/app/create",
    createAgentSlackAppValidator(),
    ai.createAgentSlackApp
  )
  .get("/api/agent/:agentId/slack/manifest", ai.downloadAgentSlackManifest)
  .post(
    "/api/agent/:agentId/telegram/toggle",
    toggleAgentTelegramDeploymentValidator(),
    ai.toggleAgentTelegramDeployment
  )
  .post(
    "/api/agent/:agentId/telegram/provision",
    provisionAgentTelegramChannelValidator(),
    ai.provisionAgentTelegramChannel
  )
  .get("/api/agent/tools", ai.fetchTools)
  .get("/api/agent/requests", ai.fetchAgentRequests)
  .get("/api/agent/:agentId/logs", ai.fetchAgentLogs)
  .get("/api/agent/:agentId/logs/session", ai.fetchAgentLogSession)
  .get("/api/agent/:agentId/logs/:requestId", ai.fetchAgentLogDetail)

const aiTestBuilderAdminRoutes = endpointGroupList
  .group(auth.builderOrAdmin)
  .addGroupMiddleware(aiTestsEnabled)
aiTestBuilderAdminRoutes
  .get("/api/agent/:agentId/tests", ai.fetchAgentTestSuite)
  .put(
    "/api/agent/:agentId/tests",
    updateAgentTestSuiteValidator(),
    ai.updateAgentTestSuite
  )
  .post(
    "/api/agent/:agentId/tests/run",
    runAgentTestSuiteValidator(),
    ai.runAgentTestSuite
  )
  .get("/api/agent/:agentId/tests/run/:runId", ai.fetchAgentTestRun)

builderAdminRoutes
  .get(
    "/api/agent/knowledge-sources/sharepoint/connect",
    ai.startSharePointAuth
  )
  .get("/api/agent/:agentId/knowledge", ai.fetchAgentKnowledgeIndex)
  .post("/api/agent/:agentId/operations/:operationId/files", ai.uploadAgentFile)
  .delete(
    "/api/agent/:agentId/operations/:operationId/files/:fileId",
    ai.deleteAgentFile
  )
  .get(
    "/api/agent/:agentId/operations/:operationId/files/:fileId/url",
    ai.fetchAgentFileUrl
  )
  .get(
    "/api/knowledge-sources/:datasourceId/:authConfigId/options",
    ai.fetchAgentKnowledgeSourceOptions
  )
  .get(
    "/api/agent/:agentId/operations/:operationId/knowledge-sources/sharepoint/entries/all",
    ai.fetchAgentKnowledgeSourceAllEntries
  )
  .post(
    "/api/agent/:agentId/operations/:operationId/knowledge-sources/sharepoint/sites",
    connectAgentSharePointSiteValidator(),
    ai.connectAgentSharePointSite
  )
  .patch(
    "/api/agent/:agentId/operations/:operationId/knowledge-sources/sharepoint/sites/:siteId",
    updateAgentSharePointSiteValidator(),
    ai.updateAgentSharePointSite
  )
  .delete(
    "/api/agent/:agentId/operations/:operationId/knowledge-sources/sharepoint/sites/:siteId",
    ai.disconnectAgentSharePointSite
  )
  .post(
    "/api/agent/:agentId/operations/:operationId/knowledge-sources/:sourceId/sync",
    syncAgentKnowledgeSourcesValidator(),
    ai.syncAgentKnowledgeSource
  )
  .post(
    "/api/agent/:agentId/operations/:operationId/knowledge/store/reset",
    ai.resetAgentKnowledgeBaseStore
  )

publicRoutes.get(
  "/api/agent/knowledge-sources/sharepoint/callback",
  ai.completeSharePointAuth
)
publicRoutes.get("/api/agent/slack/oauth/callback", ai.completeSlackOAuth)
