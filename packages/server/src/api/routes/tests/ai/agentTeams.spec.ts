interface MockWebhookChatPayload {
  chat: {
    messages: unknown[]
    title?: string
  }
  onAssistantStream?: (stream: AsyncIterable<unknown>) => Promise<void>
}

interface ChatMockModule {
  getMockChatOptions: () => Record<string, unknown>[]
  resetMockChatState: () => void
  setMockPostEphemeralResult: (
    provider: "slack" | "teams",
    result: { usedFallback: boolean }
  ) => void
}

jest.mock("@chat-adapter/teams", () => ({
  createTeamsAdapter: jest.fn(() => ({})),
}))

jest.mock("@chat-adapter/state-memory", () => ({
  createMemoryState: jest.fn(() => ({})),
}))

jest.mock("../../../controllers/ai/chatConversations", () => {
  const actual = jest.requireActual("../../../controllers/ai/chatConversations")
  return {
    ...actual,
    webhookChat: jest.fn(
      async ({ chat, onAssistantStream }: MockWebhookChatPayload) => {
        const assistantText = "Mock assistant response"
        if (onAssistantStream) {
          async function* fakeStream() {
            yield assistantText
          }
          await onAssistantStream(fakeStream())
        }
        return {
          messages: [
            ...chat.messages,
            {
              id: `assistant-${chat.messages.length + 1}`,
              role: "assistant",
              parts: [{ type: "text", text: assistantText }],
            },
          ],
          assistantText,
          title: chat.title || "Mock conversation",
        }
      }
    ),
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

import fs from "fs/promises"
import os from "os"
import path from "path"

import extract from "extract-zip"
import { context, docIds, encryption, roles } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  DocumentType,
  type Agent,
  type ChatConversation,
  type WebhookChatCompleteResult,
} from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../../tests/utilities/aiConfig"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const { getMockChatOptions, resetMockChatState, setMockPostEphemeralResult } =
  jest.requireActual("chat") as ChatMockModule
const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>
const mockedGetFileUrlForAgent = jest.mocked(sdk.ai.rag.getFileUrlForAgent)
const SECRET_ENCODING_PREFIX = "bbai_enc::"

const jsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })

const jsonErrorResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  })

const secretMatch = (plain: string, encoded: string) => {
  if (!encoded.startsWith(SECRET_ENCODING_PREFIX)) {
    throw new Error("Encoded Teams secret not properly configured.")
  }
  return encryption.compare(
    plain,
    encoded.substring(SECRET_ENCODING_PREFIX.length)
  )
}

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

describe("agent teams integration provisioning", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)

  const getPersistedChatApp = async (
    workspaceId = config.getDevWorkspaceId()
  ) =>
    await config.doInContext(workspaceId, async () => {
      return await sdk.ai.chatApps.getSingle()
    })

  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(
      config,
      "test-config"
    )
    mockedWebhookChat.mockClear()
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

  it("provisions teams channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Agent",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    const result = await config.api.agent.provisionMSTeamsChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.chatAppId).toBeTruthy()
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/ms-teams/")
    expect(result.messagingEndpointUrl).toContain(`/${result.chatAppId}/`)
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.MSTeamsIntegration?.chatAppId).toEqual(result.chatAppId)
    expect(updated?.MSTeamsIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )

    const chatApp = await getPersistedChatApp()
    expect(chatApp?.agents).toContainEqual({
      agentId: agent._id,
      isEnabled: false,
      isDefault: false,
    })
  })

  it("preserves internal agent chat state when provisioning teams", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Agent With Internal Chat",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      await db.put({
        _id: docIds.generateChatAppID(),
        agents: [{ agentId: agent._id!, isEnabled: true, isDefault: true }],
        live: true,
        createdAt: new Date().toISOString(),
      })
    })

    await config.api.agent.provisionMSTeamsChannel(agent._id!)

    const chatApp = await getPersistedChatApp()
    expect(chatApp?.agents).toContainEqual({
      agentId: agent._id,
      isEnabled: true,
      isDefault: true,
    })
  })

  it("obfuscates teams secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Teams Obfuscation Agent",
      aiconfig: "test-config",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    expect(created.MSTeamsIntegration?.appPassword).toEqual("********")

    const { agents } = await config.api.agent.fetch()
    const fetched = agents.find(a => a._id === created._id)
    expect(fetched?.MSTeamsIntegration?.appPassword).toEqual("********")

    const updated = await config.api.agent.update({
      ...(fetched as NonNullable<typeof fetched>),
      live: true,
    })
    expect(updated.MSTeamsIntegration?.appPassword).toEqual("********")

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(created._id!)
      expect(
        secretMatch(
          "teams-app-password",
          stored.MSTeamsIntegration!.appPassword!
        )
      ).toBeTrue()
    })

    await config.api.agent.update({
      ...updated,
      MSTeamsIntegration: {
        ...updated.MSTeamsIntegration,
        appPassword: undefined,
      },
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(created._id!)
      expect(
        secretMatch(
          "teams-app-password",
          stored.MSTeamsIntegration!.appPassword!
        )
      ).toBeTrue()
    })
  })

  it("returns a validation error when teams settings are missing", async () => {
    const agent = await config.api.agent.create({
      name: "No Teams Settings",
    })

    await config.api.agent.provisionMSTeamsChannel(agent._id!, undefined, {
      status: 400,
    })
  })

  it("creates a Teams app using tenant Microsoft provisioning settings", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Created App",
      description: "Created through Microsoft APIs.",
    })
    const calls: string[] = []
    let servicePrincipalAttempts = 0
    let addPasswordAttempts = 0
    let botVerificationRequests = 0
    let channelVerificationRequests = 0
    jest.spyOn(global, "fetch").mockImplementation(async (url, init) => {
      const method = init?.method || "GET"
      calls.push(`${method} ${String(url)}`)

      if (String(url).includes("/oauth2/v2.0/token")) {
        const body = init?.body as URLSearchParams
        expect(body.get("client_id")).toEqual("provisioning-client-id")
        expect(body.get("client_secret")).toEqual("provisioning-secret")
        return jsonResponse({ access_token: `token-${calls.length}` })
      }

      if (String(url).endsWith("/applications")) {
        const body = JSON.parse(String(init?.body))
        expect(body.displayName).toEqual("Teams Created App")
        return jsonResponse({ id: "graph-object-id", appId: "teams-app-id" })
      }

      if (String(url).endsWith("/servicePrincipals")) {
        servicePrincipalAttempts += 1
        if (servicePrincipalAttempts === 1) {
          return jsonErrorResponse({
            error: {
              code: "Request_BadRequest",
              message:
                "The appId 'teams-app-id' of the service principal does not reference a valid application object.",
              details: [{ code: "NoBackingApplicationObject" }],
            },
          })
        }
        const body = JSON.parse(String(init?.body))
        expect(body.appId).toEqual("teams-app-id")
        return jsonResponse({ id: "service-principal-id" })
      }

      if (String(url).endsWith("/applications/graph-object-id/addPassword")) {
        addPasswordAttempts += 1
        if (addPasswordAttempts === 1) {
          return jsonErrorResponse({
            error: {
              code: "Request_ResourceNotFound",
              message:
                "Resource 'graph-object-id' does not exist or one of its queried reference-property objects are not present.",
            },
          })
        }
        return jsonResponse({ secretText: "generated-teams-secret" })
      }

      if (
        String(url).includes("/botServices/") &&
        String(url).includes("/channels/MsTeamsChannel")
      ) {
        expect(String(url)).toContain("/botServices/budibase-teams-app-id/")
        if (method === "GET") {
          channelVerificationRequests += 1
          return jsonResponse({
            properties: {
              channelName: "MsTeamsChannel",
              properties: {
                isEnabled: true,
              },
            },
          })
        }

        const body = JSON.parse(String(init?.body))
        expect(body.kind).toEqual("azurebot")
        expect(body.sku.name).toEqual("F0")
        expect(body.properties.channelName).toEqual("MsTeamsChannel")
        expect(body.properties.properties.acceptedTerms).toBe(true)
        expect(body.properties.properties.isEnabled).toBe(true)
        return jsonResponse({})
      }

      if (String(url).includes("/botServices/")) {
        expect(String(url)).toContain("/botServices/budibase-teams-app-id")
        if (method === "GET") {
          botVerificationRequests += 1
          return jsonResponse({
            properties: {
              msaAppId: "teams-app-id",
            },
          })
        }

        const body = JSON.parse(String(init?.body))
        expect(body.properties.endpoint).toContain("/api/webhooks/ms-teams/")
        expect(body.properties.msaAppId).toEqual("teams-app-id")
        expect(body.properties.msaAppTenantId).toEqual("azure-tenant-id")
        expect(body.properties.tenantId).toEqual("azure-tenant-id")
        return jsonResponse({})
      }

      throw new Error(`Unexpected fetch ${String(url)}`)
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await sdk.ai.msTeamsAppConfig.save({
        azureTenantId: "azure-tenant-id",
        clientId: "provisioning-client-id",
        clientSecret: "provisioning-secret",
        subscriptionId: "subscription-id",
        resourceGroupName: "resource-group",
        location: "global",
      })
    })

    const result = await config.api.agent.createMSTeamsApp(agent._id!, {
      teamId: "default-team-id",
      idleTimeoutMinutes: 30,
      requireUserLink: false,
    })

    expect(result.success).toBe(true)
    expect(result.appId).toEqual("teams-app-id")
    expect(result.tenantId).toEqual("azure-tenant-id")
    expect(result.packageAvailable).toBe(true)
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/ms-teams/")
    expect(servicePrincipalAttempts).toEqual(2)
    expect(addPasswordAttempts).toEqual(2)
    expect(botVerificationRequests).toEqual(1)
    expect(channelVerificationRequests).toEqual(1)

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(agent._id!)
      expect(stored.MSTeamsIntegration?.appId).toEqual("teams-app-id")
      expect(stored.MSTeamsIntegration?.tenantId).toEqual("azure-tenant-id")
      expect(stored.MSTeamsIntegration?.teamId).toEqual("default-team-id")
      expect(stored.MSTeamsIntegration?.idleTimeoutMinutes).toEqual(30)
      expect(stored.MSTeamsIntegration?.requireUserLink).toBe(false)
      expect(
        secretMatch(
          "generated-teams-secret",
          stored.MSTeamsIntegration!.appPassword!
        )
      ).toBeTrue()
    })
  })

  it("requires tenant Microsoft provisioning settings when creating a Teams app", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Missing Provisioning Config",
    })

    await config.api.agent.createMSTeamsApp(agent._id!, undefined, {
      status: 400,
    })
  })

  it("downloads a Teams app package for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Package Agent",
      description: "Answers questions in Teams.",
      MSTeamsIntegration: {
        appId: "11111111-1111-1111-1111-111111111111",
        appPassword: "teams-package-password",
        tenantId: "azure-tenant-id",
      },
    })

    const packageBuffer = await config.api.agent.downloadMSTeamsPackage(
      agent._id!,
      {
        headers: {
          "Content-Disposition":
            /budibase-teams-teams-package-agent-package\.zip/,
          "Content-Type": /application\/zip/,
        },
      }
    )
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "teams-package-"))
    const zipPath = path.join(tempDir, "package.zip")
    await fs.writeFile(zipPath, new Uint8Array(packageBuffer))

    try {
      await extract(zipPath, { dir: tempDir })
      const manifestText = await fs.readFile(
        path.join(tempDir, "manifest.json"),
        "utf8"
      )
      const manifest = JSON.parse(manifestText)

      expect(await fs.stat(path.join(tempDir, "color.png"))).toBeTruthy()
      expect(await fs.stat(path.join(tempDir, "outline.png"))).toBeTruthy()
      expect(manifest.name.short).toEqual("Teams Package Agent")
      expect(manifest.description.short).toEqual("Answers questions in Teams.")
      expect(manifest.accentColor).toEqual("#7052FF")
      expect(manifest.id).toEqual("11111111-1111-1111-1111-111111111111")
      expect(manifest.bots[0].botId).toEqual(
        "11111111-1111-1111-1111-111111111111"
      )
      expect(manifest.bots[0].scopes).toEqual(["personal", "team", "groupChat"])
      expect(manifest.bots[0].commandLists[0].commands).toContainEqual({
        title: ChatCommands.LINK,
        description: "Link your Microsoft Teams user to Budibase.",
      })
      expect(manifest.validDomains.length).toEqual(1)
      expect(manifestText).not.toContain("teams-package-password")

      const { agents } = await config.api.agent.fetch()
      const updated = agents.find(candidate => candidate._id === agent._id)
      expect(updated?.MSTeamsIntegration?.messagingEndpointUrl).toContain(
        "/api/webhooks/ms-teams/"
      )
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  describe("teams webhook auth validation", () => {
    it("rejects requests without an authorization header", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Webhook Agent",
        MSTeamsIntegration: {
          appId: "teams-app-id",
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/chatapp-test/${agent._id}`
        )
        .send({})
        .expect(401)

      expect(response.body["jwt-auth-error"]).toEqual(
        "authorization header not found"
      )
    })
  })

  describe("teams webhook incoming messages", () => {
    const postTeamsMessage = async ({
      path,
      body,
    }: {
      path: string
      body: Record<string, unknown>
    }) =>
      await config
        .getRequest()!
        .post(path)
        .set("Authorization", "Bearer valid-token")
        .send(body)
        .expect(200)

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

    const setupProvisionedTeamsAgent = async ({
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
          name: "Teams Incoming Messages Agent",
          MSTeamsIntegration: {
            appId: "teams-app-id",
            appPassword: "teams-app-password",
            tenantId: "azure-tenant-id",
            ...(requireUserLink !== undefined && { requireUserLink }),
          },
        },
        {
          id: "operation_1",
          name: "Teams incoming messages",
          live: true,
          enabledTools: [],
          allowKnowledgeSourceDownload: allowKnowledgeSourceDownload ?? true,
        }
      )
      const channel = await config.api.agent.provisionMSTeamsChannel(agent._id!)
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
        providerTenantId = "tenant-1"
      ) => {
        await config.doInTenant(async () => {
          await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
            provider: AgentChannelProvider.MSTEAMS,
            externalUserId,
            providerTenantId,
            globalUserId: config.getUser()._id!,
            linkedBy: config.getUser()._id!,
          })
        })
      }
      return { agent, chatAppId: channel.chatAppId, linkExternalUser }
    }

    it(`returns a private link prompt for ${ChatCommands.LINK} and /${ChatCommands.LINK} commands`, async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-link-1",
          type: "message",
          text: ChatCommands.LINK,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
      expect(mockedWebhookChat).not.toHaveBeenCalled()
    })

    it("blocks unlinked users and guides them to link first", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-unlinked",
          type: "message",
          text: "hello teams",
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages.join(" ")).toContain(ChatCommands.LINK)
      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("allows optional-link unlinked users and reuses their synthetic conversation", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-optional-1",
          type: "message",
          text: "first",
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })
      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-optional-2",
          type: "message",
          text: "second",
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(2)

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual("msteams:tenant-1:user-unlinked")
      expect(conversations[0]?.messages).toHaveLength(4)

      await config.doInTenant(async () => {
        const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
          provider: AgentChannelProvider.MSTEAMS,
          externalUserId: "user-unlinked",
          providerTenantId: "tenant-1",
        })
        expect(link).toBeUndefined()
      })
    })

    it("blocks optional-link unlinked users when the agent requires a higher role", async () => {
      const { agent, chatAppId } = await setupProvisionedTeamsAgent({
        requireUserLink: false,
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-optional-blocked",
          type: "message",
          text: "hello teams",
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(mockedWebhookChat).not.toHaveBeenCalled()
      expect(response.body.messages).toContain(
        "This agent is not available to unlinked users."
      )
    })

    it("uses the linked Budibase user when linking is optional", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent({
          requireUserLink: false,
        })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-linked-optional",
          type: "message",
          text: "hello linked teams",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
    })

    it("acknowledges when the link prompt falls back to a DM", async () => {
      setMockPostEphemeralResult("teams", { usedFallback: true })

      const { agent, chatAppId } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-link-fallback",
          type: "message",
          text: "hello teams",
          from: { id: "user-unlinked", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "channel" },
          channelData: {
            channel: { id: "channel-1" },
            team: { id: "team-1" },
            tenant: { id: "tenant-1" },
          },
        },
      })

      expect(response.body.messages).toContain(
        "I sent you a DM with your Budibase link."
      )
      expect(extractLinkUrl(response.body.messages)).toBeUndefined()
      expect(mockedWebhookChat).not.toHaveBeenCalled()
    })

    it("creates a conversation from an incoming plain Teams message", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: "hello teams",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toEqual(["Mock assistant response"])
      const chatOptions = getMockChatOptions()
      expect(chatOptions[chatOptions.length - 1]).toEqual(
        expect.objectContaining({
          fallbackStreamingPlaceholderText: "Thinking...",
          streamingUpdateIntervalMs: 750,
        })
      )
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      const firstPart =
        mockedWebhookChat.mock.calls[0]?.[0].chat.messages[0]?.parts[0]
      expect(firstPart?.type === "text" ? firstPart.text : undefined).toEqual(
        "hello teams"
      )

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.channel?.provider).toEqual(
        AgentChannelProvider.MSTEAMS
      )
      expect(conversations[0]?.userId).toEqual(config.getUser()._id)
      expect(conversations[0]?.messages).toHaveLength(2)
    })

    it("sends a fallback message when the assistant returns an empty response", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "" }],
          },
        ],
        assistantText: "",
        title: "Mock conversation",
      } satisfies WebhookChatCompleteResult)

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: "hello teams",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toEqual(["No response generated."])
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
    })

    it("appends downloadable RAG source links to Teams personal replies", async () => {
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
            filename: "Source [One]\n@Draft.pdf",
          },
        ],
        title: "Mock conversation",
      })

      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-rag-personal",
          type: "message",
          text: "hello teams",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Answer with sources")
      const cardMessage = response.body.messages.find((message: string) =>
        message.includes("Source One Draft.pdf")
      )
      expect(cardMessage).toContain('"title":"Sources"')
      expect(cardMessage).toContain(
        "http://localhost:10000/files/signed/prod-budi-app-assets/source.pdf"
      )
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).toHaveBeenCalledWith(agent._id, "file-1")
    })

    it("does not append RAG source links to Teams channel replies", async () => {
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
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-channel-rag")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-rag-channel",
          type: "message",
          text: "hello in channel",
          from: { id: "user-channel-rag", name: "Teams User" },
          conversation: {
            id: "conversation-channel-rag",
            conversationType: "channel",
          },
          channelData: {
            channel: { id: "channel-rag" },
            team: { id: "team-1" },
            tenant: { id: "tenant-1" },
          },
        },
      })

      expect(response.body.messages).toContain("Answer with private sources")
      expect(response.body.messages.join("\n")).not.toContain("Sources:")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).not.toHaveBeenCalled()
    })

    it("does not append Teams RAG source links when downloads are disabled", async () => {
      mockedWebhookChat.mockResolvedValueOnce({
        messages: [
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "Answer without links" }],
          },
        ] as any,
        assistantText: "Answer without links",
        allowKnowledgeSourceDownload: false,
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
        await setupProvisionedTeamsAgent({
          allowKnowledgeSourceDownload: false,
        })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-rag-disabled",
          type: "message",
          text: "hello teams",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Answer without links")
      expect(response.body.messages.join("\n")).not.toContain("Sources:")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockedGetFileUrlForAgent).not.toHaveBeenCalled()
    })

    it("replaces the channel working indicator with the assistant reply in team channels", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-channel-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-channel-1",
          type: "message",
          text: "hello in channel",
          from: { id: "user-channel-1", name: "Teams User" },
          conversation: {
            id: "conversation-channel-1",
            conversationType: "channel",
          },
          channelData: {
            channel: { id: "channel-working-indicator" },
            team: { id: "team-1" },
            tenant: { id: "tenant-1" },
          },
        },
      })

      expect(response.body.messages).toEqual(["Mock assistant response"])
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
    })

    it("keeps the user linked for personal chat payloads that only include from.id", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const teamsUserId = "29:1ljv6N86roXr5pjPrCJVIz6xHh5QxjI-personal-only"
      await linkExternalUser(teamsUserId)

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-from-id-only-1",
          type: "message",
          text: "still linked by id?",
          from: {
            id: teamsUserId,
            name: "Teams User",
          },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
    })

    it("keeps the user linked when a later Teams payload includes aadObjectId for the same from.id", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const teamsUserId = "29:1ljv6N86roXr5pjPrCJVIz6xHh5QxjI-test"
      await linkExternalUser(teamsUserId)

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-aad-switch-1",
          type: "message",
          text: "still linked?",
          from: {
            id: teamsUserId,
            aadObjectId: "eddfa9d4-346e-4cce-a18f-fa6261ad776b",
            name: "Teams User",
          },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain("Mock assistant response")
      expect(mockedWebhookChat).toHaveBeenCalledTimes(1)
    })

    it("logs the Teams external user id that was used for lookup", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`

      const aadObjectId = "eddfa9d4-346e-4cce-a18f-fa6261ad776b"
      await linkExternalUser(aadObjectId)

      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})

      try {
        const response = await postTeamsMessage({
          path,
          body: {
            id: "activity-ask-id-mismatch-1",
            type: "message",
            text: "should explain why this is unlinked",
            from: {
              id: "29:1ljv6N86roXr5pjPrCJVIz6xHh5QxjI-id-mismatch",
              aadObjectId,
              name: "Teams User",
            },
            conversation: {
              id: "conversation-1",
              conversationType: "personal",
            },
            channelData: { tenant: { id: "tenant-1" } },
          },
        })

        expect(mockedWebhookChat).not.toHaveBeenCalled()
        expect(response.body.messages.join(" ")).toContain(ChatCommands.LINK)

        const linkLookupMissCall = warnSpy.mock.calls.find(
          ([message]) => message === "bb-warn: chat_link_lookup_miss"
        )
        expect(linkLookupMissCall).toBeTruthy()

        expect(linkLookupMissCall?.[1]).toEqual(
          expect.objectContaining({
            provider: AgentChannelProvider.MSTEAMS,
            externalUserIdTried:
              "29:1ljv6N86roXr5pjPrCJVIz6xHh5QxjI-id-mismatch",
            linkIdTried: expect.any(String),
          })
        )
      } finally {
        warnSpy.mockRestore()
      }
    })

    it("reuses the existing conversation for subsequent messages in the same scope", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-1",
          type: "message",
          text: "first",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      await postTeamsMessage({
        path,
        body: {
          id: "activity-ask-2",
          type: "message",
          text: "second",
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
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

    it("starts a new empty conversation for /new without calling chat completion", async () => {
      const { agent, chatAppId, linkExternalUser } =
        await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${chatAppId}/${agent._id}`
      await linkExternalUser("user-1")

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-new-1",
          type: "message",
          text: ChatCommands.NEW,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(response.body.messages).toContain(
        "Started a new conversation. Send a message to continue."
      )
      expect(mockedWebhookChat).not.toHaveBeenCalled()

      const conversations = await fetchConversations()
      expect(conversations).toHaveLength(1)
      expect(conversations[0]?.messages).toHaveLength(0)
    })
  })
})
