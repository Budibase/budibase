import * as ai from "../controllers/ai"
import {
  createAgentValidator,
  updateAgentValidator,
} from "./utils/validators/agent"
import {
  createAIConfigValidator,
  updateAIConfigValidator,
} from "./utils/validators/aiConfig"
import {
  createVectorDbValidator,
  updateVectorDbValidator,
} from "./utils/validators/vectorDb"
import { middleware } from "@budibase/pro"
import { builderAdminRoutes, endpointGroupList } from "./endpointGroups"

export const licensedRoutes = endpointGroupList.group(middleware.licenseAuth)

builderAdminRoutes
  .get("/api/agent", ai.fetchAgents)
  .post("/api/agent", createAgentValidator(), ai.createAgent)
  .put("/api/agent", updateAgentValidator(), ai.updateAgent)
  .delete("/api/agent/:agentId", ai.deleteAgent)
  .post("/api/agent/:agentId/discord/sync", ai.syncAgentDiscordCommands)
  .get("/api/agent/:agentId/files", ai.fetchAgentFiles)
  .post("/api/agent/:agentId/files", ai.uploadAgentFile)
  .delete("/api/agent/:agentId/files/:fileId", ai.deleteAgentFile)
  .get("/api/agent/tools", ai.fetchTools)

builderAdminRoutes
  .post("/api/ai/tables", ai.generateTables)
  .get("/api/configs", ai.fetchAIConfigs)
  .post("/api/configs", createAIConfigValidator(), ai.createAIConfig)
  .put("/api/configs", updateAIConfigValidator(), ai.updateAIConfig)
  .delete("/api/configs/:id", ai.deleteAIConfig)
  .get("/api/vectordb", ai.fetchVectorDbConfigs)
  .post("/api/vectordb", createVectorDbValidator(), ai.createVectorDbConfig)
  .put("/api/vectordb", updateVectorDbValidator(), ai.updateVectorDbConfig)
  .delete("/api/vectordb/:id", ai.deleteVectorDbConfig)
  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

builderAdminRoutes.get("/api/configs/providers", ai.fetchAIProviders)

// these are Budibase AI routes
licensedRoutes
  /** @deprecated Use the openai compatible /api/ai/chat/completions instead */
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/chat/completions", ai.chatCompletionV2)
  .post("/api/ai/upload-file", ai.uploadFile)
