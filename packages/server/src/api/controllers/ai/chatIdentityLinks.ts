import { HTTPError, utils } from "@budibase/backend-core"
import type { ChatIdentityLinkSession, UserCtx } from "@budibase/types"
import { getGlobalIDFromUserMetadataID } from "../../../db/utils"
import sdk from "../../../sdk"

const CHAT_LINK_RETURN_URL_COOKIE = "budibase:returnurl"
const BUILDER_LOGIN_PATH = "/builder/auth/login"

const resolveToken = (token?: string) => {
  if (!token) {
    throw new HTTPError("token is required", 400)
  }
  return token
}

const assertSessionMatchesInstance = ({
  workspaceId,
  instance,
}: {
  workspaceId?: string
  instance: string
}) => {
  if (!workspaceId || workspaceId !== instance) {
    throw new HTTPError("Link token is not valid for this workspace", 400)
  }
}

const getCurrentGlobalUserId = (ctx: UserCtx) => {
  const currentUserId =
    ctx.user?.globalId ||
    getGlobalIDFromUserMetadataID(ctx.user?._id || "") ||
    ctx.user?._id
  if (!currentUserId) {
    throw new HTTPError("Unable to resolve current user", 400)
  }
  return currentUserId
}

const escapeHtml = (value: string | undefined) =>
  (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const getExternalIdentityLabel = (session: ChatIdentityLinkSession) => {
  if (session.externalUserName) {
    return session.externalUserName
  }
  return session.externalUserId
}

const renderLinkConfirmationPage = (
  session: ChatIdentityLinkSession,
  action: string
) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirm chat account link</title>
  </head>
  <body>
    <p>Confirm linking your Budibase account to ${escapeHtml(session.provider)} user ${escapeHtml(getExternalIdentityLabel(session))}.</p>
    <form method="post" action="${escapeHtml(action)}">
      <input type="hidden" name="confirmationToken" value="${escapeHtml(session.confirmationToken)}">
      <button type="submit">Confirm</button>
    </form>
  </body>
</html>`
}

const renderLinkSuccessPage = () => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Authentication succeeded</title>
  </head>
  <body>
    <p>Authentication succeeded.</p>
    <script>
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.focus()
          window.close()
        } catch (error) {}
      }
    </script>
  </body>
</html>`
}

export async function handoffChatLinkSession(
  ctx: UserCtx<void, string, { instance: string; token: string }>
) {
  const token = resolveToken(ctx.params.token)
  const session =
    await sdk.ai.chatIdentityLinks.getChatIdentityLinkSession(token)
  if (!session) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: session.workspaceId,
    instance: ctx.params.instance,
  })

  if (!ctx.isAuthenticated) {
    utils.setCookie(
      ctx,
      `/api/chat-links/${ctx.params.instance}/${token}/handoff`,
      CHAT_LINK_RETURN_URL_COOKIE,
      { sign: false }
    )
    ctx.redirect(BUILDER_LOGIN_PATH)
    return
  }

  const confirmationSession =
    await sdk.ai.chatIdentityLinks.prepareChatIdentityLinkSessionConfirmation(
      token
    )
  if (!confirmationSession) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: confirmationSession.workspaceId,
    instance: ctx.params.instance,
  })

  ctx.type = "text/html"
  ctx.body = renderLinkConfirmationPage(
    confirmationSession,
    `/api/chat-links/${ctx.params.instance}/${token}/handoff`
  )
}

export async function confirmChatLinkSession(
  ctx: UserCtx<
    { confirmationToken?: string },
    string,
    { instance: string; token: string }
  >
) {
  const token = resolveToken(ctx.params.token)
  const session =
    await sdk.ai.chatIdentityLinks.getChatIdentityLinkSession(token)
  if (!session) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: session.workspaceId,
    instance: ctx.params.instance,
  })

  if (!ctx.isAuthenticated) {
    throw new HTTPError("Authentication is required to link chat identity", 401)
  }

  if (
    !session.confirmationToken ||
    ctx.request.body?.confirmationToken !== session.confirmationToken
  ) {
    throw new HTTPError("Link confirmation is invalid or has expired", 400)
  }

  const currentGlobalUserId = getCurrentGlobalUserId(ctx)
  const consumedSession =
    await sdk.ai.chatIdentityLinks.consumeChatIdentityLinkSession(token)
  if (!consumedSession) {
    throw new HTTPError("Link token is invalid or has expired", 400)
  }
  assertSessionMatchesInstance({
    workspaceId: consumedSession.workspaceId,
    instance: ctx.params.instance,
  })

  await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
    provider: consumedSession.provider,
    externalUserId: consumedSession.externalUserId,
    externalUserName: consumedSession.externalUserName,
    teamId: consumedSession.teamId,
    guildId: consumedSession.guildId,
    providerTenantId: consumedSession.providerTenantId,
    globalUserId: currentGlobalUserId,
    linkedBy: currentGlobalUserId,
  })

  ctx.type = "text/html"
  ctx.body = renderLinkSuccessPage()
}
