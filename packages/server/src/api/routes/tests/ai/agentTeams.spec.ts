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
import { context, docIds, features } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  DocumentType,
  FeatureFlag,
  type Agent,
  type ChatConversation,
  type WebhookChatCompleteResult,
} from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../../tests/utilities/aiConfig"
import { DEFAULT_MSTEAMS_SERVICE_URL } from "../../../../utilities/msTeams"
import { webhookChat } from "../../../controllers/ai/chatConversations"

const { getMockChatOptions, resetMockChatState, setMockPostEphemeralResult } =
  jest.requireActual("chat") as ChatMockModule
const mockedWebhookChat = webhookChat as jest.MockedFunction<typeof webhookChat>
const mockedGetFileUrlForAgent = jest.mocked(sdk.ai.rag.getFileUrlForAgent)
const TEAMS_APP_ID = generator.guid()

const extractLinkUrl = (messages: string[]) => {
  const urls = messages
    .flatMap(message => message.match(/https?:\/\/[^\s"\\]+/g) || [])
    .filter(url => url.includes("/api/chat-links/"))
  return urls[0]
}

const getLinkPath = (linkUrl: string) => new URL(linkUrl).pathname

describe("agent teams integration provisioning", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)

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
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })

  afterAll(() => {
    config.end()
  })

  const withEscalation = async <T>(f: () => Promise<T>) =>
    features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.ESCALATION]: true },
      f
    )

  it("returns only chat links in the agent's Teams tenant", async () => {
    await withEscalation(async () => {
      const agent = await config.api.agent.create({
        name: "Teams Agent",
        MSTeamsIntegration: {
          appId: TEAMS_APP_ID,
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      })
      const otherUser = await config.createUser()

      await config.doInTenant(async () => {
        await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
          provider: AgentChannelProvider.MSTEAMS,
          externalUserId: "reachable-user",
          providerTenantId: "azure-tenant-id",
          globalUserId: config.getUser()._id!,
        })
        await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
          provider: AgentChannelProvider.MSTEAMS,
          externalUserId: "other-workspace-user",
          providerTenantId: "other-tenant-id",
          globalUserId: otherUser._id!,
        })
      })

      const response = await config
        .getRequest()!
        .get("/api/chat-links")
        .set(await config.defaultHeaders())
        .query({ provider: AgentChannelProvider.MSTEAMS, agentId: agent._id })
        .expect(200)

      expect(response.body).toEqual([
        expect.objectContaining({ externalUserId: "reachable-user" }),
      ])
    })
  })

  it("provisions teams channel for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Agent",
      MSTeamsIntegration: {
        appId: TEAMS_APP_ID,
        appPassword: "teams-app-password",
        tenantId: "azure-tenant-id",
      },
    })

    const result = await config.api.agent.provisionMSTeamsChannel(agent._id!)

    expect(result.success).toBe(true)
    expect(result.messagingEndpointUrl).toContain("/api/webhooks/ms-teams/")
    expect(result.messagingEndpointUrl).toContain(
      `/${config.getProdWorkspaceId()}/`
    )
    expect(result.messagingEndpointUrl).toContain(`/${agent._id}`)

    const { agents } = await config.api.agent.fetch()
    const updated = agents.find(candidate => candidate._id === agent._id)
    expect(updated?.MSTeamsIntegration?.messagingEndpointUrl).toEqual(
      result.messagingEndpointUrl
    )
  })

  it("obfuscates teams secrets in responses and preserves them on update", async () => {
    const created = await config.api.agent.create({
      name: "Teams Obfuscation Agent",
      aiconfig: "test-config",
      MSTeamsIntegration: {
        appId: TEAMS_APP_ID,
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
      expect(stored.MSTeamsIntegration?.appPassword).toEqual(
        "teams-app-password"
      )
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

  it("rejects an invalid Teams app ID when updating an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Invalid Teams App ID Agent",
    })

    await config.api.agent.update(
      {
        ...agent,
        MSTeamsIntegration: {
          appId: "not-a-uuid",
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      },
      { status: 400 }
    )
  })

  it("rejects package downloads before the Teams channel is provisioned", async () => {
    const agent = await config.api.agent.create({
      name: "Unprovisioned Teams Package Agent",
      MSTeamsIntegration: {
        appId: TEAMS_APP_ID,
        appPassword: "teams-package-password",
        tenantId: "azure-tenant-id",
      },
    })

    await config.api.agent.downloadMSTeamsPackage(agent._id!, { status: 400 })
  })

  it("rejects package downloads for a stored invalid Teams app ID", async () => {
    const agent = await config.api.agent.create({
      name: "Invalid Teams Package Agent",
      MSTeamsIntegration: {
        appId: TEAMS_APP_ID,
        appPassword: "teams-package-password",
        tenantId: "azure-tenant-id",
      },
    })
    await config.api.agent.provisionMSTeamsChannel(agent._id!)

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(agent._id!)
      await db.put({
        ...stored,
        MSTeamsIntegration: {
          ...stored.MSTeamsIntegration,
          appId: "not-a-uuid",
        },
      })
    })

    await config.api.agent.downloadMSTeamsPackage(agent._id!, { status: 400 })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const stored = await db.get<Agent>(agent._id!)
      expect(stored.MSTeamsIntegration?.appPackageVersion).toBeUndefined()
    })
  })

  it("downloads a Teams app package for an agent", async () => {
    const agent = await config.api.agent.create({
      name: "Teams Package Agent",
      description: "Answers questions in Teams.",
      MSTeamsIntegration: {
        appId: TEAMS_APP_ID,
        appPassword: "teams-package-password",
        tenantId: "azure-tenant-id",
      },
    })
    await config.api.agent.provisionMSTeamsChannel(agent._id!)
    const { agents: agentsBeforeDownload } = await config.api.agent.fetch()
    const agentBeforeDownload = agentsBeforeDownload.find(
      candidate => candidate._id === agent._id
    )

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
      const colorIcon = await fs.readFile(path.join(tempDir, "color.png"))
      const outlineIcon = await fs.readFile(path.join(tempDir, "outline.png"))

      expect(colorIcon.readUInt32BE(16)).toEqual(192)
      expect(colorIcon.readUInt32BE(20)).toEqual(192)
      expect(outlineIcon.readUInt32BE(16)).toEqual(32)
      expect(outlineIcon.readUInt32BE(20)).toEqual(32)
      expect(manifest.manifestVersion).toEqual("1.28")
      expect(manifest.version).toEqual("1.0.1")
      expect(manifest.name.short).toEqual("Teams Package Agent")
      expect(manifest.description.short).toEqual("Answers questions in Teams.")
      expect(manifest.accentColor).toEqual("#7052FF")
      expect(manifest.id).toEqual(TEAMS_APP_ID)
      expect(manifest.bots[0].botId).toEqual(TEAMS_APP_ID)
      expect(manifest.bots[0].scopes).toEqual(["personal", "team", "groupChat"])
      expect(manifest.bots[0].commandLists[0].commands).toContainEqual({
        title: ChatCommands.LINK,
        description: "Link your Microsoft Teams user to Budibase.",
      })
      expect(manifest.validDomains).toHaveLength(1)
      expect(manifestText).not.toContain("teams-package-password")

      const { agents: agentsAfterFirstDownload } =
        await config.api.agent.fetch()
      const agentAfterFirstDownload = agentsAfterFirstDownload.find(
        candidate => candidate._id === agent._id
      )
      expect(
        agentAfterFirstDownload?.MSTeamsIntegration?.appPackageVersion
      ).toBeUndefined()
      await config.api.agent.update({
        ...(agentAfterFirstDownload as NonNullable<
          typeof agentAfterFirstDownload
        >),
        description: "Updated after downloading the Teams package.",
      })

      const secondPackageBuffer = await config.api.agent.downloadMSTeamsPackage(
        agent._id!
      )
      const secondTempDir = path.join(tempDir, "second")
      await fs.mkdir(secondTempDir)
      const secondZipPath = path.join(secondTempDir, "package.zip")
      await fs.writeFile(secondZipPath, new Uint8Array(secondPackageBuffer))
      await extract(secondZipPath, { dir: secondTempDir })
      const secondManifest = JSON.parse(
        await fs.readFile(path.join(secondTempDir, "manifest.json"), "utf8")
      )

      expect(secondManifest.version).toEqual("1.0.2")
      expect(secondManifest.id).toEqual(manifest.id)

      const { agents: agentsAfterDownload } = await config.api.agent.fetch()
      const agentAfterDownload = agentsAfterDownload.find(
        candidate => candidate._id === agent._id
      )
      expect(agentAfterDownload?._rev).not.toEqual(agentBeforeDownload?._rev)
      expect(
        agentAfterDownload?.MSTeamsIntegration?.appPackageVersion
      ).toBeUndefined()
      expect(
        agentAfterDownload?.MSTeamsIntegration?.messagingEndpointUrl
      ).toEqual(agentBeforeDownload?.MSTeamsIntegration?.messagingEndpointUrl)

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const stored = await db.get<Agent>(agent._id!)
        expect(stored.MSTeamsIntegration?.appPackageVersion).toEqual("1.0.2")
      })
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  describe("teams webhook auth validation", () => {
    it("rejects requests without an authorization header", async () => {
      const agent = await config.api.agent.create({
        name: "Teams Webhook Agent",
        MSTeamsIntegration: {
          appId: TEAMS_APP_ID,
          appPassword: "teams-app-password",
          tenantId: "azure-tenant-id",
        },
      })
      await config.publish()

      const response = await config
        .getRequest()!
        .post(
          `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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
        .send({
          serviceUrl: DEFAULT_MSTEAMS_SERVICE_URL,
          ...body,
        })
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
      allowKnowledgeSourceDownload,
    }: {
      requireUserLink?: boolean
      allowKnowledgeSourceDownload?: boolean
    } = {}) => {
      const agent = await config.api.agent.createWithOperation(
        {
          name: "Teams Incoming Messages Agent",
          MSTeamsIntegration: {
            appId: TEAMS_APP_ID,
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
      await config.api.agent.provisionMSTeamsChannel(agent._id!)
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
      return { agent, linkExternalUser }
    }

    it("rejects an activity with an untrusted service URL", async () => {
      const { agent } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

      const response = await config
        .getRequest()!
        .post(path)
        .set("Authorization", "Bearer valid-token")
        .send({
          type: "message",
          serviceUrl: "https://example.com/",
        })
        .expect(400)

      expect(response.body.error).toEqual("Invalid Microsoft Teams service URL")
      expect(mockedWebhookChat).not.toHaveBeenCalled()
    })

    it(`returns a private link prompt for ${ChatCommands.LINK} and /${ChatCommands.LINK} commands`, async () => {
      const { agent } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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

      const linkUrl = extractLinkUrl(response.body.messages)
      expect(linkUrl).toBeTruthy()
      expect(mockedWebhookChat).not.toHaveBeenCalled()

      const handoff = await config
        .getRequest()!
        .get(getLinkPath(linkUrl!))
        .set(config.defaultHeaders({}, true))
        .expect(200)
      expect(handoff.text).toContain(
        "Link your Budibase account to <strong>Teams User</strong> on <strong>Teams</strong>."
      )
      expect(handoff.text).not.toContain("msteams")
    })

    it("still serves legacy webhook URLs containing the removed chat app segment", async () => {
      const { agent } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/chatapp_legacy/${agent._id}`

      const response = await postTeamsMessage({
        path,
        body: {
          id: "activity-link-legacy",
          type: "message",
          text: ChatCommands.LINK,
          from: { id: "user-1", name: "Teams User" },
          conversation: { id: "conversation-1", conversationType: "personal" },
          channelData: { tenant: { id: "tenant-1" } },
        },
      })

      expect(extractLinkUrl(response.body.messages)).toBeTruthy()
    })

    it("blocks unlinked users and guides them to link first", async () => {
      const { agent } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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
      const { agent } = await setupProvisionedTeamsAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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

    it("uses the linked Budibase user when linking is optional", async () => {
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent({
        requireUserLink: false,
      })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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

      const { agent } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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

      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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

      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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

      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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

      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent({
        allowKnowledgeSourceDownload: false,
      })
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`

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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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
      const { agent, linkExternalUser } = await setupProvisionedTeamsAgent()
      const path = `/api/webhooks/ms-teams/${config.getProdWorkspaceId()}/${agent._id}`
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
