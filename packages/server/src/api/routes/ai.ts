import * as ai from "../controllers/ai"
import {
  createAgentValidator,
  updateAgentValidator,
} from "./utils/validators/agent"
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
  .post("/api/agent/chat/stream", ai.agentChatStream)
  .delete("/api/agent/chats/:chatId", ai.remove)
  .get("/api/agent/:agentId/chats", ai.fetchHistory)
  .get("/api/configs", ai.fetchAIConfigs)
  .post("/api/configs", ai.createAIConfig)
  .put("/api/configs", ai.updateAIConfig)
  .delete("/api/configs/:id", ai.deleteAIConfig)
  .get("/api/vectordb", ai.fetchVectorDbConfigs)
  .post("/api/vectordb", ai.createVectorDbConfig)
  .put("/api/vectordb", ai.updateVectorDbConfig)
  .delete("/api/vectordb/:id", ai.deleteVectorDbConfig)
  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

// these are Budibase AI routes
licensedRoutes
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/upload-file", ai.uploadFile)
