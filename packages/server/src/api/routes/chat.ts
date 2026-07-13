import * as ai from "../controllers/ai"
import { permissions } from "@budibase/backend-core"
import { type UserCtx } from "@budibase/types"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import type { Middleware } from "koa"
import {
  builderAdminRoutes,
  endpointGroupList,
} from "./endpointGroups"

const userRoutes = endpointGroupList.group({
  middleware: authorized(
    permissions.PermissionType.WORKSPACE,
    permissions.PermissionLevel.READ
  ),
  first: false,
})

const requireAuthenticatedSession: Middleware<unknown, UserCtx> = async (
  ctx,
  next
) => {
  if (!ctx.user) {
    return ctx.throw(401, "No user info found")
  }
  if (!ctx.isAuthenticated) {
    return ctx.throw(401, "Session not authenticated")
  }
  return next()
}

const authenticatedRoutes = endpointGroupList.group({
  middleware: requireAuthenticatedSession,
  first: false,
})

builderAdminRoutes
  .get("/api/chat-links", ai.listChatIdentityLinks)
  .get("/api/slack-channels", ai.listSlackChannels)
  .get("/api/teams-channels", ai.listMSTeamsChannels)
  .put("/api/chatapps/:chatAppId", ai.updateChatApp)
  .post("/api/chatapps/:chatAppId/agent", ai.setChatAppAgent)

authenticatedRoutes
  .get("/api/chat-links/:instance/:token", ai.getChatLinkSessionView)
  .post(
    "/api/chat-links/:instance/:token/confirm",
    ai.confirmChatLinkSession
  )

userRoutes
  .get("/api/chatapps", ai.fetchChatApp)
  .get("/api/chatapps/:chatAppId", ai.fetchChatAppById)
  .get("/api/chatapps/:chatAppId/agents", ai.fetchChatAppAgents)
  .get(
    "/api/chatapps/:chatAppId/agents/:agentId/operations/:operationId/files/:fileId/url",
    ai.fetchChatAppAgentFileUrl
  )
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
