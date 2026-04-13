import nock from "nock"
import { context, db, features } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core/tests"
import type { MockAgent } from "undici"
import {
  type Agent,
  AgentKnowledgeSourceType,
  FeatureFlag,
  KnowledgeBaseFileStatus,
  type KnowledgeBaseFile,
} from "@budibase/types"
import environment, { setEnv } from "../../../../environment"
import { getQueue } from "../../../../sdk/workspace/ai/rag/queue"
import { upsertKnowledgeSourceConnection } from "../../../../sdk/workspace/ai/knowledgeSources"
import { sharePointConnectionCacheKey } from "../../../../sdk/workspace/ai/sharepoint"
import { installHttpMocking, resetHttpMocking } from "../../../../tests/jestEnv"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent files", () => {
  const config = new TestConfiguration()
  let cleanup: ReturnType<typeof setEnv> | undefined
  let mockAgent: MockAgent

  const withRagEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )
  }

  beforeAll(() => {
    cleanup = setEnv({ GEMINI_API_KEY: "test-gemini-key" })
    mockAgent = installHttpMocking()
  })

  afterAll(async () => {
    await resetHttpMocking()
    config.end()
    cleanup?.()
  })

  beforeEach(async () => {
    await config.newTenant()
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  const fileBuffer = Buffer.from("Hello from Budibase")

  const mockLiteLLMProviders = () =>
    nock(environment.LITELLM_URL)
      .persist()
      .get("/public/providers/fields")
      .reply(200, [
        {
          provider: "OpenAI",
          provider_display_name: "OpenAI",
          litellm_provider: "openai",
          credential_fields: [
            { key: "api_key", label: "API Key", field_type: "password" },
            { key: "api_base", label: "Base URL", field_type: "text" },
          ],
        },
      ])

  const mockLiteLLMModelCostMap = () =>
    nock(environment.LITELLM_URL)
      .persist()
      .get("/public/litellm_model_cost_map")
      .reply(200, {
        "text-embedding-3-small": {
          litellm_provider: "openai",
          mode: "embedding",
        },
      })

  const mockAutoKnowledgeBaseCreate = () => {
    mockLiteLLMProviders()
    mockLiteLLMModelCostMap()

    return nock(environment.LITELLM_URL)
      .post("/team/new")
      .reply(200, { team_id: "team-2" })
      .post("/key/generate")
      .reply(200, { token_id: "embed-key-2", key: "embed-secret-2" })
      .post("/v1/vector_stores")
      .reply(200, { id: "vector-store-1" })
      .post("/key/update")
      .reply(200, { status: "success" })
  }

  const mockGeminiIngest = (fileId: string) =>
    nock(environment.LITELLM_URL)
      .post("/v1/rag/ingest")
      .reply(200, { file_id: fileId })

  const mockGeminiFileDelete = (vectorStoreId: string, fileId: string) =>
    nock(environment.LITELLM_URL)
      .delete(
        `/v1/vector_stores/${encodeURIComponent(vectorStoreId)}/files/${encodeURIComponent(fileId)}`
      )
      .reply(200, { deleted: true })

  const setSharePointSourceInAgent = async (
    agentId: string,
    siteIds: string[]
  ) => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const agentDoc = await db.tryGet<Agent>(agentId)
      await db.put({
        ...agentDoc!,
        knowledgeSources: siteIds.map(siteId => ({
          id: `sharepoint_site_${siteId}`,
          type: AgentKnowledgeSourceType.SHAREPOINT,
          config: {
            site: { id: siteId },
          },
        })),
      })
    })
  }

  const setSharePointConnection = async (_agentId: string) => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const workspaceId = context.getOrThrowWorkspaceId()
      const workspaceConnectionId = db.getProdWorkspaceID(workspaceId)
      await upsertKnowledgeSourceConnection(
        "sharepoint",
        sharePointConnectionCacheKey("connection", workspaceConnectionId),
        {
          tenantId: config.getTenantId(),
          tokenEndpoint:
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
          accessToken: "header.payload.signature",
          refreshToken: "refresh-token",
          tokenType: "Bearer",
          expiresAt: Date.now() + 60_000,
          clientId: "client-id",
          clientSecret: "client-secret",
        }
      )
    })
  }

  const mockSharePointSitesFetch = (siteIds: string[], times = 6) => {
    const graphPool = mockAgent.get("https://graph.microsoft.com")
    for (let i = 0; i < times; i++) {
      graphPool
        .intercept({
          method: "GET",
          path: /.*/,
        })
        .reply(200, {
          value: siteIds.map(id => ({ id })),
        })
    }
  }

  it("uploads and lists files attached to an agent", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "Support Agent",
        aiconfig: "default",
      })

      const autoKbScope = mockAutoKnowledgeBaseCreate()
      const ingestScope = mockGeminiIngest("gemini-file-1")

      const upload = await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "notes.txt",
      })
      expect(upload.file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScope.isDone()).toBe(true)
      expect(autoKbScope.isDone()).toBe(true)

      const { files } = await config.api.agent.fetchFiles(created._id!)
      expect(files).toHaveLength(1)
      expect(files[0].status).toBe(KnowledgeBaseFileStatus.READY)
      expect(files[0].filename).toBe("notes.txt")

      const refreshed = await config.api.agent.fetch()
      const saved = refreshed.agents.find(agent => agent._id === created._id)
      expect(saved?.knowledgeBases?.length).toBe(1)
    })
  })

  it("deletes an uploaded agent file", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "Support Agent",
        aiconfig: "default",
      })

      mockAutoKnowledgeBaseCreate()
      const ingestScope = mockGeminiIngest("gemini-file-2")
      const deleteScope = mockGeminiFileDelete(
        "vector-store-1",
        "gemini-file-2"
      )

      const upload = await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "docs.txt",
      })

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScope.isDone()).toBe(true)

      const response = await config.api.agent.removeFile(
        created._id!,
        upload.file._id!
      )
      expect(response.deleted).toBe(true)
      expect(deleteScope.isDone()).toBe(true)

      const { files } = await config.api.agent.fetchFiles(created._id!)
      expect(files).toHaveLength(0)
    })
  })

  it("returns 400 when syncing SharePoint without a connected source", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Agent",
        aiconfig: "default",
      })

      await config.api.agent.syncKnowledgeSources(
        created._id!,
        { sourceIds: ["site-1"] },
        {
          status: 400,
          body: {
            message: "SharePoint is not connected for this agent",
          },
        }
      )
    })
  })

  it("returns 400 when setting SharePoint sites without a connected source", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Set Sites Agent",
        aiconfig: "default",
      })

      await config.api.agent.setKnowledgeSources(
        created._id!,
        { sourceIds: ["site-1"] },
        {
          status: 400,
          body: {
            message: "SharePoint is not connected for this agent",
          },
        }
      )
    })
  })

  it("returns empty SharePoint sites for an agent without a connection", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Sites Agent",
        aiconfig: "default",
      })

      const response = await config.api.agent.fetchKnowledgeSourceOptions(
        created._id!
      )

      expect(response.options).toEqual([])
    })
  })

  it("returns empty SharePoint sync state for an agent without sync runs", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Sync State Agent",
        aiconfig: "default",
      })

      const response = await config.api.agent.fetchKnowledgeSourceOptions(
        created._id!
      )

      expect(response.runs).toEqual([])
    })
  })

  it("sync SharePoint accepts empty body and still returns no-connection error", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Sync Empty Agent",
        aiconfig: "default",
      })

      await config.api.agent.syncKnowledgeSources(
        created._id!,
        {},
        { status: 400 }
      )
    })
  })

  it("removes Gemini files for removed SharePoint sites when setting SharePoint sites", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Cleanup Agent",
        aiconfig: "default",
      })

      mockAutoKnowledgeBaseCreate()
      const ingestScopeOne = mockGeminiIngest("gemini-file-a")
      const ingestScopeTwo = mockGeminiIngest("gemini-file-b")

      await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "site-one.txt",
      })
      await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "site-two.txt",
      })

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScopeOne.isDone()).toBe(true)
      expect(ingestScopeTwo.isDone()).toBe(true)

      const { files: uploadedFiles } = await config.api.agent.fetchFiles(
        created._id!
      )
      const siteOne = uploadedFiles.find(
        file => file.filename === "site-one.txt"
      )
      const siteTwo = uploadedFiles.find(
        file => file.filename === "site-two.txt"
      )
      expect(siteOne?._id).toBeDefined()
      expect(siteTwo?._id).toBeDefined()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const siteOneDoc = await db.tryGet<KnowledgeBaseFile>(siteOne!._id!)
        const siteTwoDoc = await db.tryGet<KnowledgeBaseFile>(siteTwo!._id!)
        await db.put({
          ...siteOneDoc!,
          externalSourceId: "sharepoint:site-1:drive-1:item-1",
        })
        await db.put({
          ...siteTwoDoc!,
          externalSourceId: "sharepoint:site-2:drive-2:item-2",
        })
      })

      await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])
      await setSharePointConnection(created._id!)
      mockSharePointSitesFetch(["site-1", "site-2"])
      mockSharePointSitesFetch(["site-1", "site-2"])
      const deleteScope = mockGeminiFileDelete(
        "vector-store-1",
        "gemini-file-a"
      )
      const response = await config.api.agent.setKnowledgeSources(
        created._id!,
        {
          sourceIds: ["site-2"],
        }
      )

      expect(deleteScope.isDone()).toBe(true)
      expect(response.options.map(site => site.id)).toEqual([
        "site-1",
        "site-2",
      ])

      const { files: remainingFiles } = await config.api.agent.fetchFiles(
        created._id!
      )
      expect(remainingFiles.map(file => file.filename).sort()).toEqual([
        "site-two.txt",
      ])
    })
  })

  it("disconnect endpoint removes all SharePoint files", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Disconnect Endpoint Agent",
        aiconfig: "default",
      })

      mockAutoKnowledgeBaseCreate()
      const ingestScopeOne = mockGeminiIngest(
        "gemini-file-disconnect-endpoint-a"
      )
      const ingestScopeTwo = mockGeminiIngest(
        "gemini-file-disconnect-endpoint-b"
      )

      await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "site-one-disconnect-endpoint.txt",
      })
      await config.api.agent.uploadFile(created._id!, {
        file: fileBuffer,
        name: "site-two-disconnect-endpoint.txt",
      })

      await utils.queue.processMessages(getQueue().getBullQueue())
      expect(ingestScopeOne.isDone()).toBe(true)
      expect(ingestScopeTwo.isDone()).toBe(true)

      const { files: uploadedFiles } = await config.api.agent.fetchFiles(
        created._id!
      )
      const siteOne = uploadedFiles.find(file =>
        file.filename.includes("site-one")
      )
      const siteTwo = uploadedFiles.find(file =>
        file.filename.includes("site-two")
      )

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const siteOneDoc = await db.tryGet<KnowledgeBaseFile>(siteOne!._id!)
        const siteTwoDoc = await db.tryGet<KnowledgeBaseFile>(siteTwo!._id!)
        await db.put({
          ...siteOneDoc!,
          externalSourceId: "sharepoint:site-1:drive-1:item-1",
          uploadedBy: "sharepoint:site-1",
        })
        await db.put({
          ...siteTwoDoc!,
          externalSourceId: "sharepoint:site-2:drive-2:item-2",
          uploadedBy: "sharepoint:site-2",
        })
      })

      await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])

      const deleteScopeOne = mockGeminiFileDelete(
        "vector-store-1",
        "gemini-file-disconnect-endpoint-a"
      )
      const deleteScopeTwo = mockGeminiFileDelete(
        "vector-store-1",
        "gemini-file-disconnect-endpoint-b"
      )

      const response = await config.api.agent.disconnectKnowledgeSources(
        created._id!
      )
      expect(response).toEqual({
        agentId: created._id!,
        disconnected: true,
      })
      expect(deleteScopeOne.isDone()).toBe(true)
      expect(deleteScopeTwo.isDone()).toBe(true)

      const { files: remainingFiles } = await config.api.agent.fetchFiles(
        created._id!
      )
      expect(remainingFiles).toHaveLength(0)
    })
  })
})
