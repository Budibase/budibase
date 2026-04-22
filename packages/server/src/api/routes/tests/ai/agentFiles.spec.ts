import nock from "nock"
import { context, db, features } from "@budibase/backend-core"
import { utils } from "@budibase/backend-core/tests"
import type { MockAgent } from "undici"
import {
  type Agent,
  AgentKnowledgeSourceType,
  FeatureFlag,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import environment, { setEnv } from "../../../../environment"
import { getQueue } from "../../../../sdk/workspace/ai/rag/queue"
import * as knowledgeSourceSyncQueue from "../../../../sdk/workspace/ai/rag/knowledgeSourceSyncQueue"
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
    await resetHttpMocking()
    mockAgent = installHttpMocking()
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

  const mockSharePointSitesFetch = (
    sites: Array<{
      id: string
      displayName?: string
      name?: string
      webUrl?: string
    }>,
    times = 6
  ) => {
    const graphPool = mockAgent.get("https://graph.microsoft.com")
    for (let i = 0; i < times; i++) {
      graphPool
        .intercept({
          method: "POST",
          path: "/v1.0/search/query",
        })
        .reply(200, {
          value: [
            {
              hitsContainers: [
                {
                  moreResultsAvailable: false,
                  hits: sites.map(site => ({
                    resource: site,
                  })),
                },
              ],
            },
          ],
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
        { sourceId: "site-1" },
        {
          status: 400,
          body: {
            message: "SharePoint is not connected for this agent",
          },
        }
      )
    })
  })

  it("returns 400 when connecting a SharePoint site without a connected source", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Set Sites Agent",
        aiconfig: "default",
      })

      await config.api.agent.connectSharePointSite(
        created._id!,
        { siteId: "site-1" },
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

  it("sync SharePoint with wrong source ids returns no-connection error", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Sync Empty Agent",
        aiconfig: "default",
      })

      await config.api.agent.syncKnowledgeSources(
        created._id!,
        { sourceId: "wrongId" },
        { status: 400 }
      )
    })
  })

  it("rejects changing knowledge sources via generic agent update", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Agent Update Guard",
        aiconfig: "default",
      })

      await config.api.agent.update(
        {
          ...created,
          knowledgeSources: [
            {
              id: "sharepoint_site_test",
              type: AgentKnowledgeSourceType.SHAREPOINT,
              config: {
                site: {
                  id: "site-1",
                },
              },
            },
          ],
        } as any,
        {
          status: 400,
          body: {
            message: "knowledgeSources cannot be updated from this endpoint",
          },
        }
      )
    })
  })

  it("allows generic agent update when knowledge sources are unchanged", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Agent Update No Change",
        aiconfig: "default",
      })

      await setSharePointSourceInAgent(created._id!, ["site-1"])

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const workspaceDb = context.getWorkspaceDB()
        const current = await workspaceDb.tryGet<Agent>(created._id!)
        expect(current).toBeDefined()

        const updated = await config.api.agent.update({
          ...current!,
          name: "SharePoint Agent Update No Change 2",
          knowledgeSources: current!.knowledgeSources,
          knowledgeBases: current!.knowledgeBases,
        } as any)

        expect(updated.name).toBe("SharePoint Agent Update No Change 2")
      })
    })
  })

  it("disconnect endpoint returns success and removes one SharePoint source", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Disconnect Agent",
        aiconfig: "default",
      })

      await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])

      const response = await config.api.agent.disconnectSharePointSite(
        created._id!,
        "site-1"
      )
      expect(response).toEqual({
        agentId: created._id!,
        disconnected: true,
        siteId: "site-1",
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const updated = await db.tryGet<Agent>(created._id!)
        const siteIds = (updated?.knowledgeSources || [])
          .filter(source => source.type === AgentKnowledgeSourceType.SHAREPOINT)
          .map(source => source.config.site?.id)
          .filter((id): id is string => !!id)
        expect(siteIds).toEqual(["site-2"])
      })
    })
  })

  it("returns SharePoint options with displayName and webUrl", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Options Agent",
        aiconfig: "default",
      })

      await setSharePointConnection(created._id!)
      mockSharePointSitesFetch(
        [
          {
            id: "site-1",
            displayName: "Adria Site",
            name: "Legacy Name",
            webUrl: "https://contoso.sharepoint.com/sites/adria",
          },
        ],
        1
      )

      const response = await config.api.agent.fetchKnowledgeSourceOptions(
        created._id!
      )

      expect(response.options).toEqual([
        {
          id: "site-1",
          name: "Adria Site",
          webUrl: "https://contoso.sharepoint.com/sites/adria",
        },
      ])
    })
  })

  it("disconnect endpoint enqueues cleanup for the removed site", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.agent.create({
        name: "SharePoint Disconnect Queue Agent",
        aiconfig: "default",
      })
      await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])
      const queueAddSpy = jest.spyOn(knowledgeSourceSyncQueue.getQueue(), "add")

      await config.api.agent.disconnectSharePointSite(created._id!, "site-1")

      const hasDisconnectJob = queueAddSpy.mock.calls.some(([data]) => {
        return (
          data.agentId === created._id! &&
          data.jobType === "disconnect_sharepoint_site" &&
          data.siteId === "site-1"
        )
      })
      expect(hasDisconnectJob).toBe(true)
    })
  })
})
