interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
}

interface ChatMockModule {
  resetMockChatState: () => void
  setMockPostEphemeralResult: (
    provider: "slack" | "teams" | "telegram",
    result: { usedFallback: boolean }
  ) => void
}

interface SlackManifest {
  display_information: {
    name: string
    description: string
  }
  features: {
    app_home: {
      home_tab_enabled: boolean
      messages_tab_enabled: boolean
      messages_tab_read_only_enabled: boolean
    }
    bot_user: {
      display_name: string
      always_online: boolean
    }
    slash_commands: Array<{
      command: string
      url: string
      description: string
      usage_hint: string
      should_escape: boolean
    }>
  }
  oauth_config: {
    scopes: {
      bot: string[]
    }
  }
  settings: {
    event_subscriptions: {
      request_url: string
      bot_events: string[]
    }
    interactivity: {
      is_enabled: boolean
      request_url: string
    }
    org_deploy_enabled: boolean
    socket_mode_enabled: boolean
    token_rotation_enabled: boolean
  }
}

jest.mock("@chat-adapter/slack", () => ({
  createSlackAdapter: jest.fn(() => ({})),
}))

jest.mock("@chat-adapter/state-memory", () => ({
  createMemoryState: jest.fn(() => ({})),
}))

jest.mock("../../../controllers/ai/chatConversations", () => {
  const actual = jest.requireActual("../../../controllers/ai/chatConversations")
  return {
    ...actual,
    webhookChat: jest.fn(async ({ chat }: MockWebhookChatPayload) => ({
      messages: [
        ...chat.messages,
        {
          id: `assistant-${chat.messages.length + 1}`,
          role: "assistant",
          parts: [{ type: "text", text: "Mock assistant response" }],
        },
      ],
      assistantText: "Mock assistant response",
      title: chat.title || "Mock conversation",
    })),
  }
})

jest.mock("../../../../sdk/workspace/ai/rag", () => {
  const actual = jest.requireActual<
    typeof import("../../../../sdk/workspace/ai/rag")
  >("../../../../sdk/workspace/ai/rag")
  return {
    ...actual,
    getFileUrlForAgent: jest.fn(),
  }
})

import sdk from "../../../../sdk"
import { context, db, docIds, encryption, roles } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  DocumentType,
  type Agent,
  type ChatApp,
  type ChatConversation,
  type SlackAppConfig,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../../tests/utilities/aiConfig"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const SECRET_ENCODING_PREFIX = "bbai_enc::"
const { resetMockChatState, setMockPostEphemeralResult } = jest.requireActual(
  "chat"
) as ChatMockModule

const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>
const mockedGetFileUrlForAgent = jest.mocked(sdk.ai.rag.getFileUrlForAgent)

const slackJsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })

const resetWebhookChatMock = () => {
  mockedWebhookChat.mockReset()
  mockedWebhookChat.mockImplementation(async ({ chat }) => ({
    messages: [
      ...chat.messages,
      {
        id: `assistant-${chat.messages.length + 1}`,
        role: "assistant",
        parts: [{ type: "text", text: "Mock assistant response" }],
      },
    ],
    assistantText: "Mock assistant response",
    title: chat.title || "Mock conversation",
  }))
}

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

const extractConfirmationToken = (html: string) =>
  html.match(/name="confirmationToken" value="([^"]+)"/)?.[1]

const secretMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith(SECRET_ENCODING_PREFIX)) {
    throw new Error("Encoded slack secret not properly configured.")
  }
  return encryption.compare(
    plain,
    encoded.substring(SECRET_ENCODING_PREFIX.length)
  )
}

describe("agent slack integration provisioning", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)

  async function getPersistedAgent(id: string | undefined) {
    const result = await db.doWithDB(config.getDevWorkspaceId(), db =>
      db.tryGet<Agent>(id)
    )
    if (!result) {
      throw new Error(`Agent ${id} not found`)
    }
    return result
  }

  const getPersistedChatApp = async () =>
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      return await sdk.ai.chatApps.getSingle()
    })

  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(
      config,
      "test-config"
    )
    resetWebhookChatMock()
    mockedGetFileUrlForAgent.mockReset()
    resetMockChatState()
  })

  afterEach(async () => {
    if (jest.isMockFunction(global.fetch)) {
      jest.mocked(global.fetch).mockRestore()
    }
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })

  afterAll(() => {
    config.end()
  })

  it("provisions slack channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Slack Agent",
      slackIntegration: {
        botToken: "xoxb-token-1",
        signingSecret: "slack-signing-secret",
      },
    })

    const result = await config.api.agent.provisionSlackChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/slack/")
    expect(result.messagingEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.slackIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.slackIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )

    const chatApp = await getPersistedChatApp()
    expect(chatApp?.agents).toContainEqual({
      agentId: agent._id,
      isEnabled: false,
      isDefault: false,
    })
  })

  it("obfuscates slack secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Slack Obfuscation Agent",
      aiconfig: "test-config",
      slackIntegration: {
        botToken: "xoxb-token-2",
        signingSecret: "slack-signing-secret-2",
      },
    })

    expect(created.slackIntegration?.botToken).toEqual("********")
    expect(created.slackIntegration?.signingSecret).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)
    expect(fetched?.slackIntegration?.botToken).toEqual("********")
    expect(fetched?.slackIntegration?.signingSecret).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })
    expect(updated.slackIntegration?.botToken).toEqual("********")
    expect(updated.slackIntegration?.signingSecret).toEqual("********")

    const persisted = await getPersistedAgent(created._id)
    expect(
      secretMatch("xoxb-token-2", persisted.slackIntegration!.botToken!)
    ).toBeTrue()
    expect(
      secretMatch(
        "slack-signing-secret-2",
        persisted.slackIntegration!.signingSecret!
      )
    ).toBeTrue()
  })

  it("returns a validation error when slack settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Slack Settings",
    })

    await config.api.agent.provisionSlackChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  it("downloads a Slack app manifest for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Slack Manifest Agent",
      description: "Answers questions in Slack.",
      slackIntegration: {
        botToken: "xoxb-token-manifest",
        signingSecret: "slack-signing-secret-manifest",
      },
    })

    const manifestText = await config.api.agent.downloadSlackManifest(
      agent._id!,
      {
        headers: {
          "Content-Disposition":
            /budibase-slack-slack-manifest-agent-manifest\.json/,
        },
      }
    )
    const manifest = JSON.parse(manifestText) as SlackManifest
    const endpointUrl = manifest.settings.event_subscriptions.request_url

    expect(manifest.display_information).toEqual({
      name: "Slack Manifest Agent",
      description: "Answers questions in Slack.",
    })
    expect(manifest.features.app_home).toEqual({
      home_tab_enabled: false,
      messages_tab_enabled: true,
      messages_tab_read_only_enabled: false,
    })
    expect(manifest.features.bot_user.always_online).toBe(true)
    expect(endpointUrl).toContain("/api/webhooks/slack/")
    expect(endpointUrl).toContain(`/${config.getProdWorkspaceId()}/`)
    expect(endpointUrl).toContain(`/${agent._id}`)
    expect(manifest.settings.interactivity.request_url).toEqual(endpointUrl)
    expect(manifest.features.slash_commands).toContainEqual({
      command: `/${ChatCommands.LINK}`,
      url: endpointUrl,
      description: "Link your Slack user to your Budibase account.",
      usage_hint: `/${ChatCommands.LINK}`,
      should_escape: false,
    })
    expect(manifest.settings.event_subscriptions.bot_events).toEqual([
      "app_mention",
      "message.im",
    ])
    expect(manifest.oauth_config.scopes.bot).toEqual([
      "app_mentions:read",
      "channels:history",
      "chat:write",
      "commands",
      "im:history",
      "im:read",
      "im:write",
    ])
    expect(manifestText).not.toContain("xoxb-token-manifest")
    expect(manifestText).not.toContain("slack-signing-secret-manifest")

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.slackIntegration?.messagingEndpointUrl).toEqual(endpointUrl)
  })

  it("downloads a Slack app manifest without Slack credentials", async () => {
    const agent = await config.api.agent.create({
      name: "No Slack Manifest Settings",
    })

    const manifestText = await config.api.agent.downloadSlackManifest(agent._id!)
    const manifest = JSON.parse(manifestText) as SlackManifest
    const endpointUrl = manifest.settings.event_subscriptions.request_url

    expect(endpointUrl).toContain("/api/webhooks/slack/")
    expect(endpointUrl).toContain(`/${config.getProdWorkspaceId()}/`)
    expect(endpointUrl).toContain(`/${agent._id}`)
    expect(manifest.settings.interactivity.request_url).toEqual(endpointUrl)

    const persisted = await getPersistedAgent(agent._id)
    expect(persisted.slackIntegration?.chatAppId).toBeTruthy()
    expect(persisted.slackIntegration?.messagingEndpointUrl).toEqual(endpointUrl)
  })

  it("creates a Slack app from the generated manifest", async () => {
    const agent = await config.api.agent.create({
      name: "Slack Created App",
      description: "Created through Slack API.",
    })
    jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (String(url).endsWith("/tooling.tokens.rotate")) {
        expect(
          (init?.headers as Record<string, string>)["Content-Type"]
        ).toEqual("application/x-www-form-urlencoded")
        expect((init?.body as URLSearchParams).get("refresh_token")).toEqual(
          "xoxe-refresh-token"
        )
        return slackJsonResponse({
          ok: true,
          token: "xoxe-rotated-config-token",
          refresh_token: "xoxe-rotated-refresh-token",
          exp: Math.floor(Date.now() / 1000) + 43200,
        })
      }

      const body = JSON.parse(String(init?.body))
      const manifest = JSON.parse(body.manifest)
      expect((init?.headers as Record<string, string>).Authorization).toEqual(
        "Bearer xoxe-rotated-config-token"
      )
      expect(body.token).toBeUndefined()
      expect(manifest.oauth_config.redirect_urls[0]).toContain(
        "/api/agent/slack/oauth/callback"
      )
      expect(manifest.settings.event_subscriptions.request_url).toContain(
        "/api/webhooks/slack/"
      )
      return slackJsonResponse({
        ok: true,
        app_id: "A_SLACK_APP",
        credentials: {
          client_id: "slack-client-id",
          client_secret: "slack-client-secret",
          signing_secret: "slack-signing-secret-created",
        },
        oauth_authorize_url:
          "https://slack.com/oauth/v2/authorize?client_id=slack-client-id&scope=commands,chat:write",
      })
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await sdk.ai.slackAppConfig.save(
        "xoxe-config-token",
        "xoxe-refresh-token"
      )
    })

    const result = await config.api.agent.createSlackApp(agent._id!)

    expect(result.success).toBe(true)
    expect(result.appId).toEqual("A_SLACK_APP")
    expect(result.oauthAuthorizeUrl).toContain("state=")
    expect(result.oauthAuthorizeUrl).toContain("redirect_uri=")
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/slack/")

    const persisted = await getPersistedAgent(agent._id)
    expect(persisted.slackIntegration?.appId).toEqual("A_SLACK_APP")
    expect(persisted.slackIntegration?.clientId).toEqual("slack-client-id")
    expect(
      secretMatch(
        "slack-client-secret",
        persisted.slackIntegration!.clientSecret!
      )
    ).toBeTrue()
    expect(
      secretMatch(
        "slack-signing-secret-created",
        persisted.slackIntegration!.signingSecret!
      )
    ).toBeTrue()
    expect(persisted.slackIntegration?.botToken).toBeUndefined()
  })

  it("requires a tenant Slack app configuration token when creating a Slack app", async () => {
    const agent = await config.api.agent.create({
      name: "Slack Missing Config App",
    })

    await config.api.agent.createSlackApp(agent._id!, undefined, {
      status: 400,
    })
  })

  it("rotates Slack app configuration tokens before using an expiring token", async () => {
    let rotations = 0
    jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      expect(String(url)).toContain("/tooling.tokens.rotate")
      expect((init?.headers as Record<string, string>)["Content-Type"]).toEqual(
        "application/x-www-form-urlencoded"
      )
      rotations += 1
      expect((init?.body as URLSearchParams).get("refresh_token")).toEqual(
        rotations === 1 ? "xoxe-refresh-token" : "xoxe-rotated-refresh-token-1"
      )
      return slackJsonResponse({
        ok: true,
        token: `xoxe-rotated-config-token-${rotations}`,
        refresh_token: `xoxe-rotated-refresh-token-${rotations}`,
        exp: Math.floor(Date.now() / 1000) + (rotations === 1 ? 60 : 43200),
      })
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await sdk.ai.slackAppConfig.save(
        "xoxe-config-token",
        "xoxe-refresh-token"
      )

      const token = await sdk.ai.slackAppConfig.fetchConfigToken()

      expect(token).toEqual("xoxe-rotated-config-token-2")
      const persisted = (await sdk.ai.slackAppConfig.fetch()) as SlackAppConfig
      expect(
        secretMatch("xoxe-rotated-config-token-2", persisted.configToken)
      ).toBeTrue()
      expect(
        secretMatch("xoxe-rotated-refresh-token-2", persisted.refreshToken!)
      ).toBeTrue()
      expect(rotations).toEqual(2)
    })
  })

  it("completes Slack OAuth and stores the bot token", async () => {
    const agent = await config.api.agent.create({
      name: "Slack OAuth App",
    })
    jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (String(url).endsWith("/tooling.tokens.rotate")) {
        expect(
          (init?.headers as Record<string, string>)["Content-Type"]
        ).toEqual("application/x-www-form-urlencoded")
        expect((init?.body as URLSearchParams).get("refresh_token")).toEqual(
          "xoxe-refresh-token"
        )
        return slackJsonResponse({
          ok: true,
          token: "xoxe-rotated-oauth-config-token",
          refresh_token: "xoxe-rotated-oauth-refresh-token",
          exp: Math.floor(Date.now() / 1000) + 43200,
        })
      }

      if (String(url).endsWith("/apps.manifest.create")) {
        return slackJsonResponse({
          ok: true,
          app_id: "A_SLACK_OAUTH_APP",
          credentials: {
            client_id: "slack-oauth-client-id",
            client_secret: "slack-oauth-client-secret",
            signing_secret: "slack-oauth-signing-secret",
          },
          oauth_authorize_url:
            "https://slack.com/oauth/v2/authorize?client_id=slack-oauth-client-id&scope=commands,chat:write",
        })
      }

      expect(String(url)).toContain("/oauth.v2.access")
      const body = init?.body as URLSearchParams
      expect(body.get("code")).toEqual("slack-oauth-code")
      expect(body.get("client_id")).toEqual("slack-oauth-client-id")
      return slackJsonResponse({
        ok: true,
        access_token: "xoxb-oauth-bot-token",
        bot_user_id: "U_BOT",
        app_id: "A_SLACK_OAUTH_APP",
        team: {
          id: "T_SLACK",
          name: "Slack Team",
        },
      })
    })
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await sdk.ai.slackAppConfig.save(
        "xoxe-config-token",
        "xoxe-refresh-token"
      )
    })
    const created = await config.api.agent.createSlackApp(agent._id!)
    const state = new URL(created.oauthAuthorizeUrl).searchParams.get("state")
    expect(state).toBeTruthy()

    await config
      .getRequest()!
      .get(
        `/api/agent/slack/oauth/callback?code=slack-oauth-code&state=${state}`
      )
      .expect(302)

    const persisted = await getPersistedAgent(agent._id)
    expect(
      secretMatch("xoxb-oauth-bot-token", persisted.slackIntegration!.botToken!)
    ).toBeTrue()
    expect(persisted.slackIntegration?.botUserId).toEqual("U_BOT")
    expect(persisted.slackIntegration?.teamId).toEqual("T_SLACK")
    expect(persisted.slackIntegration?.teamName).toEqual("Slack Team")
  })

  it("publishes Slack OAuth credentials for live agents", async () => {
    const agent = await config.api.agent.createWithOperation(
      {
        name: "Live Slack OAuth App",
        aiconfig: "test-config",
      },
      {
        id: "operation_1",
        name: "Live Slack OAuth operation",
        live: true,
        enabledTools: [],
        allowKnowledgeSourceDownload: true,
      }
    )
    const liveAgent = await config.api.agent.update({
      ...agent,
      live: true,
    })
    await config.publish()

    let manifestEndpointUrl: string | undefined
    jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      if (String(url).endsWith("/tooling.tokens.rotate")) {
        return slackJsonResponse({
          ok: true,
          token: "xoxe-rotated-live-oauth-config-token",
          refresh_token: "xoxe-rotated-live-oauth-refresh-token",
          exp: Math.floor(Date.now() / 1000) + 43200,
        })
      }

      if (String(url).endsWith("/apps.manifest.create")) {
        const body = JSON.parse(String(init?.body))
        const manifest = JSON.parse(body.manifest) as SlackManifest
        manifestEndpointUrl = manifest.settings.event_subscriptions.request_url
        return slackJsonResponse({
          ok: true,
          app_id: "A_LIVE_SLACK_OAUTH_APP",
          credentials: {
            client_id: "live-slack-oauth-client-id",
            client_secret: "live-slack-oauth-client-secret",
            signing_secret: "live-slack-oauth-signing-secret",
          },
          oauth_authorize_url:
            "https://slack.com/oauth/v2/authorize?client_id=live-slack-oauth-client-id&scope=commands,chat:write",
        })
      }

      expect(String(url)).toContain("/oauth.v2.access")
      const body = init?.body as URLSearchParams
      expect(body.get("code")).toEqual("live-slack-oauth-code")
      expect(body.get("client_id")).toEqual("live-slack-oauth-client-id")
      return slackJsonResponse({
        ok: true,
        access_token: "xoxb-live-oauth-bot-token",
        bot_user_id: "U_LIVE_BOT",
        app_id: "A_LIVE_SLACK_OAUTH_APP",
        team: {
          id: "T_LIVE_SLACK",
          name: "Live Slack Team",
        },
      })
    })
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await sdk.ai.slackAppConfig.save(
        "xoxe-config-token",
        "xoxe-refresh-token"
      )
    })

    const created = await config.api.agent.createSlackApp(liveAgent._id!)
    expect(manifestEndpointUrl).toEqual(created.messagingEndpointUrl)
    expect(created.messagingEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(created.messagingEndpointUrl).toContain(`/${created.chatAppId}/`)

    const devPersisted = await getPersistedAgent(liveAgent._id)
    expect(devPersisted.slackIntegration?.chatAppId).toBeTruthy()
    expect(devPersisted.slackIntegration?.chatAppId).not.toEqual(
      created.chatAppId
    )

    const prodChatApp = await db.doWithDB(
      config.getProdWorkspaceId(),
      workspaceDb => workspaceDb.tryGet<ChatApp>(created.chatAppId)
    )
    expect(prodChatApp?.agents).toContainEqual({
      agentId: liveAgent._id,
      isEnabled: false,
      isDefault: false,
    })

    const state = new URL(created.oauthAuthorizeUrl).searchParams.get("state")
    expect(state).toBeTruthy()

    await config
      .getRequest()!
      .get(
        `/api/agent/slack/oauth/callback?code=live-slack-oauth-code&state=${state}`
      )
      .expect(302)

    const prodPersisted = await db.doWithDB(
      config.getProdWorkspaceId(),
      workspaceDb => workspaceDb.get<Agent>(liveAgent._id!)
    )
    expect(
      secretMatch(
        "xoxb-live-oauth-bot-token",
        prodPersisted.slackIntegration!.botToken!
      )
    ).toBeTrue()
    expect(
      secretMatch(
        "live-slack-oauth-signing-secret",
        prodPersisted.slackIntegration!.signingSecret!
      )
    ).toBeTrue()
    expect(prodPersisted.slackIntegration?.botUserId).toEqual("U_LIVE_BOT")
    expect(prodPersisted.slackIntegration?.teamId).toEqual("T_LIVE_SLACK")
    expect(prodPersisted.slackIntegration?.teamName).toEqual("Live Slack Team")
    expect(prodPersisted.slackIntegration?.chatAppId).toEqual(created.chatAppId)
    expect(prodPersisted.slackIntegration?.messagingEndpointUrl).toEqual(
      created.messagingEndpointUrl
    )
  })

  describe("slack webhook incoming messages", () => {
    const postSlackMessage = async ({
      path,
      body,
    }: {
      path: string
      body: Record<string, unknown>
    }) => await config.getRequest()!.post(path).send(body).expect(200)

    const fetchConversations = async () =>
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const response = await db.allDocs<ChatConversation>(
          docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
            include_docs: true,
          })
        )
        return response.rows
          .map(row => row.doc)
          .filter((chat): chat is ChatConversation => !!chat)
      })

    const setupProvisionedSlackAgent = async ({
      requireUserLink,
      roleId,
      allowKnowledgeSourceDownload,
    }: {
      requireUserLink?: boolean
      roleId?: string
      allowKnowledgeSourceDownload?: boolean
    } = {}) => {
      const agent = await config.api.agent.createWithOperation(
        {
          name: "Slack Incoming Messages Agent",
          slackIntegration: {
            botToken: "xoxb-token-3",
            signingSecret: "slack-signing-secret-3",
            ...(requireUserLink !== undefined && { requireUserLink }),
          },
        },
        {
          id: "operation_1",
          name: "Slack incoming messages",
          live: true,
          enabledTools: [],
          allowKnowledgeSourceDownload: allowKnowledgeSourceDownload ?? true,
        }
      )
      const channel = await config.api.agent.provisionSlackChannel(agent._id!)
      if (roleId) {
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const chatApp = await sdk.ai.chatApps.getSingle()
          if (!chatApp) {
            throw new Error("Chat app not found")
          }
          await sdk.ai.chatApps.update({
            ...chatApp,
            agents: chatApp.agents.map(chatAgent =>
              chatAgent.agentId === agent._id
                ? { ...chatAgent, roleId }
                : chatAgent
            ),
          })
        })
      }
      await config.publish()
      const linkExternalUser = async (
        externalUserId: string,
        teamId = "T123"
      ) => {
        await config.doInTenant(async () => {
          await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
            provider: AgentChannelProvider.SLACK,
            externalUserId,
            teamId,
            globalUserId: config.getUser()._id!,
            linkedBy: config.getUser()._id!,
          })
        })
      }
      return { agent, chatAppId: channel.chatAppId, linkExternalUser }
    }

    const getLinkPath = (linkUrl: string) => new URL(linkUrl).pathname

    it(`returns a private link prompt for the /${ChatCommands.LINK} slash command`, async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postSlackMessage({
        path,
        body: {
          command: `/${ChatCommands.LINK}`,
          text: "",
          channel_id: "D123",
          user_id: "user-1",
          user_name: "Slack User",
          team_id: "T123",
        },
      })

      const linkUrl = extractLinkUrl(response.body.messages)
      expect(linkUrl).toBeTruthy()
      expect(linkUrl).toContain("/handoff")
    })

    it(`shows already-linked guidance when /${ChatCommands.LINK} is run for an existing mapping`, async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          command: `/${ChatCommands.LINK}`,
          text: "",
          channel_id: "D123",
          user_id: "user-1",
          user_name: "Slack User",
          team_id: "T123",
        },
      })

      expect(response.body.messages.join(" ")).toContain("already linked")
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("stores Slack links separately for the same external user in different teams", async () => {
      const otherUser = await config.createUser()

      await config.doInTenant(async () => {
        await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T123",
          globalUserId: config.getUser()._id!,
          linkedBy: config.getUser()._id!,
        })
        await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T456",
          globalUserId: otherUser._id!,
          linkedBy: otherUser._id!,
        })

        const firstLink = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T123",
        })
        const secondLink = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T456",
        })

        expect(firstLink?.globalUserId).toEqual(config.getUser()._id)
        expect(secondLink?.globalUserId).toEqual(otherUser._id)
      })
    })

    it("completes link tokens for authenticated users and consumes the token once", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const linkResponse = await postSlackMessage({
        path,
        body: {
          command: `/${ChatCommands.LINK}`,
          text: "",
          channel_id: "D123",
          user_id: "user-1",
          user_name: "Slack User",
          team_id: "T123",
        },
      })

      const linkUrl = extractLinkUrl(linkResponse.body.messages)
      expect(linkUrl).toBeTruthy()

      const handoffPath = getLinkPath(linkUrl!)

      const unauthHandoff = await config
        .getRequest()!
        .get(handoffPath)
        .expect(302)
      expect(unauthHandoff.headers.location).toEqual("/builder/auth/login")
      const cookies = Array.isArray(unauthHandoff.headers["set-cookie"])
        ? unauthHandoff.headers["set-cookie"]
        : []
      expect(
        cookies.some((cookie: string) =>
          cookie.startsWith("budibase:returnurl=/api/chat-links/")
        )
      ).toBe(true)

      const authHandoff = await config
        .getRequest()!
        .get(handoffPath)
        .set(config.defaultHeaders({}, true))
        .expect(200)
      expect(authHandoff.type).toEqual("text/html")
      expect(authHandoff.text).toContain("Confirm chat account link")
      const confirmationToken = extractConfirmationToken(authHandoff.text)
      expect(confirmationToken).toBeTruthy()

      await config.doInTenant(async () => {
        const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T123",
        })
        expect(link).toBeUndefined()
      })

      await config
        .getRequest()!
        .post(handoffPath)
        .set(config.defaultHeaders({}, true))
        .send({})
        .expect(400)

      const confirmHandoff = await config
        .getRequest()!
        .post(handoffPath)
        .set(config.defaultHeaders({}, true))
        .send({ confirmationToken })
        .expect(200)
      expect(confirmHandoff.type).toEqual("text/html")
      expect(confirmHandoff.text).toContain("Authentication succeeded.")

      await config.doInTenant(async () => {
        const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-1",
          teamId: "T123",
        })
        expect(link?.globalUserId).toEqual(config.getUser()._id)
      })

      await config
        .getRequest()!
        .get(handoffPath)
        .set(config.defaultHeaders({}, true))
        .expect(400)

      const chatResponse = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello after linking",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(chatResponse.body.messages).toContain("Mock assistant response")
    })

    it("blocks unlinked users and guides them to link first", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-unlinked",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages.join(" ")).toContain(
        `/${ChatCommands.LINK}`
      )
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("allows optional-link unlinked users and reuses their synthetic conversation", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "first",
            user: "user-unlinked",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })
      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "second",
            user: "user-unlinked",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.200",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual("slack:T123:user-unlinked")
      expect(conversations[0]?.messages).toHaveLength(4)

      await config.doInTenant(async () => {
        const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.SLACK,
          externalUserId: "user-unlinked",
          teamId: "T123",
        })
        expect(link).toBeUndefined()
      })
    })

    it("blocks optional-link unlinked users when the agent requires a higher role", async () => {
      const { agent, chatAppId } = await setupProvisionedSlackAgent({
        requireUserLink: false,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-unlinked",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages).toContain(
        "This agent is not available to unlinked users."
      )
    })

    it("uses the linked Budibase user when linking is optional", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent({
          requireUserLink: false,
        })
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello linked slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
    })

    it("acknowledges when the link prompt falls back to a DM", async () => {
      setMockPostEphemeralResult("slack", { usedFallback: true })

      const { agent, chatAppId } = await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postSlackMessage({
        path,
        body: {
          command: `/${ChatCommands.LINK}`,
          text: "",
          channel_id: "C123",
          team_id: "T123",
          user_id: "user-unlinked",
          user_name: "Slack User",
        },
      })

      expect(response.body.messages).toContain(
        "I sent you a DM with your Budibase link."
      )
      expect(extractLinkUrl(response.body.messages)).toBeUndefined()
    })

    it("creates a conversation from an incoming message", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      const firstPart =
        mockedWebhookChat.mock.calls[0]?.[0].chat.messages[0]?.parts[0]
      expect(firstPart?.type === "text" ? firstPart.text : undefined).toEqual(
        "hello slack"
      )

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.channel?.provider).toEqual(
        AgentChannelProvider.SLACK
      )
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
      expect(conversations[0]?.messages).toHaveLength(2)
    })

    it("formats Slack assistant replies using mrkdwn", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [
              {
                type: "text",
                text: "# Summary\nUse **bold** and *italic*.\n- First bullet\n[Leave link](https://example.com/docs)",
              },
            ],
          },
        ] as any,
        assistantText:
          "# Summary\nUse **bold** and *italic*.\n- First bullet\n[Leave link](https://example.com/docs)",
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain(
        "*Summary*\nUse *bold* and _italic_.\n• First bullet\n[Leave link](https://example.com/docs)"
      )
    })

    it("appends downloadable RAG source links to Slack assistant replies", async () => {
      mockedGetFileUrlForAgent.mockResolvedValue(
        "/files/signed/prod-budi-app-assets/source.pdf"
      )
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Answer with sources" }],
          },
        ] as any,
        assistantText: "Answer with sources",
        ragSources: [
          {
            sourceId: "source-1",
            fileId: "file-1",
            filename: "Source <One>|Draft.pdf",
          },
        ],
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain(
        [
          "Answer with sources",
          "",
          "Sources:",
          "- <http://localhost:10000/files/signed/prod-budi-app-assets/source.pdf|Source One Draft.pdf>",
        ].join("\n")
      )
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).toHaveBeenCalledWith(agent._id, "file-1")
    })

    it("does not append RAG source links to Slack channel replies", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Answer with private sources" }],
          },
        ] as any,
        assistantText: "Answer with private sources",
        ragSources: [
          {
            sourceId: "source-1",
            fileId: "file-1",
            filename: "Source.pdf",
          },
        ],
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "<@U123> hello slack",
            user: "user-1",
            channel: "C123",
            channel_type: "channel",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Answer with private sources")
      expect(response.body.messages.join("\n")).not.toContain("Sources:")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).not.toHaveBeenCalled()
    })

    it("does not append RAG source links when downloads are disabled", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Answer without links" }],
          },
        ] as any,
        assistantText: "Answer without links",
        ragSources: [
          {
            sourceId: "source-1",
            fileId: "file-1",
            filename: "Source.pdf",
          },
        ],
        allowKnowledgeSourceDownload: false,
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent({
          allowKnowledgeSourceDownload: false,
        })
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Answer without links")
      expect(response.body.messages.join("\n")).not.toContain("Sources:")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).not.toHaveBeenCalled()
    })

    it("ignores RAG sources without file ids in Slack replies", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Answer without source ids" }],
          },
        ] as any,
        assistantText: "Answer without source ids",
        ragSources: [
          {
            sourceId: "source-1",
            filename: "Source.pdf",
          },
        ],
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "hello slack",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      expect(response.body.messages).toContain("Answer without source ids")
      expect(response.body.messages.join("\n")).not.toContain("Sources:")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).not.toHaveBeenCalled()
    })

    it("reuses the existing conversation for subsequent messages in the same scope", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "first",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "second",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.200",
            team_id: "T123",
          },
        },
      })

      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)
      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.messages).toHaveLength(4)
      const userTexts = conversations[0]!.messages
        .filter(message => message.role === "user")
        .map(
          message =>
            message.parts?.[0]?.type === "text" && message.parts[0].text
        )
      expect(userTexts).toEqual(["first", "second"])
    })

    it("creates a separate conversation for a different thread", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedSlackAgent()
      const path = `/api/webhooks/slack/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "first thread message",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.100",
            thread_ts: "1700000000.100",
            team_id: "T123",
          },
        },
      })

      await postSlackMessage({
        path,
        body: {
          type: "event_callback",
          event: {
            type: "message",
            text: "second thread message",
            user: "user-1",
            channel: "D123",
            channel_type: "im",
            ts: "1700000000.200",
            thread_ts: "1700000000.200",
            team_id: "T123",
          },
        },
      })

      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(2)
      const userTextsByConversation = conversations
        .map(conversation =>
          conversation.messages
            .filter(message => message.role === "user")
            .map(
              message =>
                message.parts?.[0]?.type === "text" && message.parts[0].text
            )
        )
        .sort((a, b) => {
          const first = typeof a[0] === "string" ? a[0] : ""
          const second = typeof b[0] === "string" ? b[0] : ""
          return first.localeCompare(second)
        })

      expect(userTextsByConversation).toEqual([
        ["first thread message"],
        ["second thread message"],
      ])
    })
  })
})
