import * as ai from "../controllers/ai"
import {
  createAgentValidator,
  updateAgentValidator,
} from "./utils/validators/agent"
import {
  createRagConfigValidator,
  updateRagConfigValidator,
} from "./utils/validators/ragConfig"
import { middleware } from "@budibase/pro"
import { builderAdminRoutes, endpointGroupList } from "./endpointGroups"

export const licensedRoutes = endpointGroupList.group(middleware.licenseAuth)

builderAdminRoutes
  .get("/api/agent", ai.fetchAgents)
  .post("/api/agent", createAgentValidator(), ai.createAgent)
  .put("/api/agent", updateAgentValidator(), ai.updateAgent)
  .delete("/api/agent/:agentId", ai.deleteAgent)
  .get("/api/agent/:agentId/files", ai.fetchAgentFiles)
  .post("/api/agent/:agentId/files", ai.uploadAgentFile)
  .delete("/api/agent/:agentId/files/:fileId", ai.deleteAgentFile)
  .get("/api/agent/tools", ai.fetchTools)

builderAdminRoutes
  .post("/api/ai/tables", ai.generateTables)
  .get("/api/chatapps", ai.fetchChatApp)
  .get("/api/chatapps/:chatAppId", ai.fetchChatAppById)
  .put("/api/chatapps/:chatAppId", ai.updateChatApp)
  .post("/api/chatapps/:chatAppId/agent", ai.setChatAppAgent)
  .get("/api/chatapps/:chatAppId/conversations", ai.fetchChatHistory)
  .get(
    "/api/chatapps/:chatAppId/conversations/:chatConversationId",
    ai.fetchChatConversation
  )
  .post("/api/chatapps/:chatAppId/conversations", ai.createChatConversation)
  .delete(
    "/api/chatapps/:chatAppId/conversations/:chatConversationId",
    ai.removeChatConversation
  )
  .post(
    "/api/chatapps/:chatAppId/conversations/:chatConversationId/stream",
    ai.agentChatStream
  )
  .get("/api/configs", ai.fetchAIConfigs)
  .post("/api/configs", ai.createAIConfig)
  .put("/api/configs", ai.updateAIConfig)
  .delete("/api/configs/:id", ai.deleteAIConfig)
  .get("/api/ragconfig", ai.fetchRagConfigs)
  .post("/api/ragconfig", createRagConfigValidator(), ai.createRagConfig)
  .put("/api/ragconfig", updateRagConfigValidator(), ai.updateRagConfig)
  .delete("/api/ragconfig/:id", ai.deleteRagConfig)
  .get("/api/vectordb", ai.fetchVectorDbConfigs)
  .post("/api/vectordb", ai.createVectorDbConfig)
  .put("/api/vectordb", ai.updateVectorDbConfig)
  .delete("/api/vectordb/:id", ai.deleteVectorDbConfig)
  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

builderAdminRoutes.get("/api/configs/providers", ai.fetchAIProviders)

// these are Budibase AI routes
licensedRoutes
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/upload-file", ai.uploadFile)
