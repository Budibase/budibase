import * as ai from "../controllers/ai"
import { auth } from "@budibase/backend-core"
import { escalationEnabled } from "../../middleware/escalationEnabled"
import {
  builderAdminRoutes,
  endpointGroupList,
  publicRoutes,
} from "./endpointGroups"

const escalationSupportRoutes = endpointGroupList
  .group(auth.builderOrAdmin)
  .addGroupMiddleware(escalationEnabled)

escalationSupportRoutes
  .get("/api/chat-links", ai.listChatIdentityLinks)
  .get("/api/slack-channels", ai.listSlackChannels)
  .get("/api/teams-channels", ai.listMSTeamsChannels)

publicRoutes.get(
  "/api/chat-links/:instance/:token/handoff",
  ai.handoffChatLinkSession
)
publicRoutes.post(
  "/api/chat-links/:instance/:token/handoff",
  ai.confirmChatLinkSession
)

builderAdminRoutes.post(
  "/api/chatapps/:chatAppId/conversations/:chatConversationId/stream",
  ai.agentChatStream
)
