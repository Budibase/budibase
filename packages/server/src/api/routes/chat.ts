import * as ai from "../controllers/ai"
import { auth, permissions } from "@budibase/backend-core"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { escalationEnabled } from "../../middleware/escalationEnabled"
import { endpointGroupList, publicRoutes } from "./endpointGroups"

const userRoutes = endpointGroupList.group({
  middleware: authorized(
    permissions.PermissionType.WORKSPACE,
    permissions.PermissionLevel.READ
  ),
  first: false,
})

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

userRoutes.post(
  "/api/chatapps/:chatAppId/conversations/:chatConversationId/stream",
  ai.agentChatStream
)
