import * as ai from "../controllers/ai"
import {
  createAgentValidator,
  createToolSourceValidator,
  updateAgentValidator,
  updateToolSourceValidator,
} from "./utils/validators/agent"
import { middleware } from "@budibase/pro"
import { builderAdminRoutes, endpointGroupList } from "./endpointGroups"

export const licensedRoutes = endpointGroupList.group(middleware.licenseAuth)

builderAdminRoutes
  .get("/api/agent", ai.fetchAgents)
  .post("/api/agent", createAgentValidator(), ai.createAgent)
  .put("/api/agent", updateAgentValidator(), ai.updateAgent)
  .delete("/api/agent/:agentId", ai.deleteAgent)

builderAdminRoutes
  .post("/api/ai/tables", ai.generateTables)
  .get("/api/chatapps", ai.fetchChatApp)
  .get("/api/chatapps/:chatAppId", ai.fetchChatAppById)
  .put("/api/chatapps/:chatAppId", ai.updateChatApp)
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
  .post(
    "/api/agent/toolsource",
    createToolSourceValidator(),
    ai.createToolSource
  )
  .put(
    "/api/agent/toolsource",

    updateToolSourceValidator(),
    ai.updateToolSource
  )
  .delete(
    "/api/agent/toolsource/:toolSourceId",

    ai.deleteToolSource
  )
  .get("/api/agent/toolsource/:toolSourceType/tools", ai.fetchAvailableTools)
  .get("/api/agent/:agentId/toolsource", ai.fetchToolSources)
  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

// these are Budibase AI routes
licensedRoutes
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/upload-file", ai.uploadFile)
