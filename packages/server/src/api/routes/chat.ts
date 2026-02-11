import * as ai from "../controllers/ai"
import { permissions } from "@budibase/backend-core"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { builderAdminRoutes, endpointGroupList } from "./endpointGroups"

const userRoutes = endpointGroupList.group({
  middleware: authorized(
    permissions.PermissionType.WORKSPACE,
    permissions.PermissionLevel.READ
  ),
  first: false,
})

builderAdminRoutes
  .put("/api/chatapps/:chatAppId", ai.updateChatApp)
  .post("/api/chatapps/:chatAppId/agent", ai.setChatAppAgent)

userRoutes
  .get("/api/chatapps", ai.fetchChatApp)
  .get("/api/chatapps/:chatAppId", ai.fetchChatAppById)
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
