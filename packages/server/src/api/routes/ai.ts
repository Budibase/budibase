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
  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

// these are Budibase AI routes
licensedRoutes
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/upload-file", ai.uploadFile)
