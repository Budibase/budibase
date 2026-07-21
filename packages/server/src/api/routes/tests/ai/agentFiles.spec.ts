import nock from "nock"
import { context } from "@budibase/backend-core"
import { mocks, utils } from "@budibase/backend-core/tests"
import type { MockAgent } from "undici"
import {
  type Agent,
  type AgentOperation,
  AgentKnowledgeSourceType,
  AgentKnowledgeSourceSyncRunStatus,
  KnowledgeBaseFileStatus,
  RestAuthType,
} from "@budibase/types"
import environment, { setEnv } from "../../../../environment"
import { getQueue } from "../../../../sdk/workspace/ai/rag/ragQueue"
import * as knowledgeSourceSyncQueue from "../../../../sdk/workspace/ai/rag/sources/knowledgeSourceSyncQueue"
import { installHttpMocking, resetHttpMocking } from "../../../../tests/jestEnv"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("agent files", () => {
  const config = new TestConfiguration()
  let cleanup: ReturnType<typeof setEnv> | undefined
  let mockAgent: MockAgent

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
    mocks.licenses.useCloudFree()
    await resetHttpMocking()
    mockAgent = installHttpMocking()
    await config.newTenant()
    jest.restoreAllMocks()
    nock.cleanAll()
  })

  const fileBuffer = Buffer.from("Hello from Budibase")
  const operation = {
    id: "operation_1",
    name: "Main operation",
    live: false,
    allowKnowledgeSourceDownload: false,
  }

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
    siteIds: string[],
    datasourceId = "datasource_1",
    authConfigId = "auth_1"
  ) => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const agentDoc = await db.tryGet<Agent>(agentId)
      await db.put({
        ...agentDoc!,
        operations: [
          {
            ...(agentDoc?.operations?.[0] || {
              id: "operation_1",
              name: "Main operation",
              live: false,
            }),
            knowledgeSources: siteIds.map(siteId => ({
              id: `sharepoint_site_${siteId}`,
              type: AgentKnowledgeSourceType.SHAREPOINT,
              config: {
                datasourceId,
                authConfigId,
                site: { id: siteId },
              },
            })),
          },
        ],
      })
    })
  }

  const setSharePointConnection = async (_agentId: string) => {
    return await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const datasourceId = `datasource_${new Date().getTime()}`
      const authConfigId = `auth_${new Date().getTime()}`
      await db.put({
        _id: datasourceId,
        type: "datasource",
        source: "REST",
        name: "SharePoint Test DS",
        config: {
          url: "https://graph.microsoft.com/v1.0",
          authConfigs: [
            {
              _id: authConfigId,
              type: RestAuthType.OAUTH2,
              name: "SharePoint OAuth2",
              url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
              clientId: "client-id",
              clientSecret: "client-secret",
              method: "BODY",
              grantType: "client_credentials",
              scope: "https://graph.microsoft.com/.default",
              accessToken: "header.payload.signature",
              tokenType: "Bearer",
              expiresAt: Date.now() + 60_000,
            },
          ],
        },
      })
      return {
        datasourceId,
        authConfigId,
      }
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
          method: "GET",
          path: path => path.startsWith("/v1.0/sites?"),
        })
        .reply(200, {
          value: sites,
        })
    }
  }

  const mockSharePointOAuthTokenFetch = (times = 10) =>
    nock("https://login.microsoftonline.com")
      .post("/common/oauth2/v2.0/token")
      .times(times)
      .reply(200, {
        access_token: "sharepoint-test-token",
        token_type: "Bearer",
        expires_in: 3600,
      })

  const setupSharePointKnowledgeOptionsFixture = async (
    agentId: string,
    sites: Array<{
      id: string
      displayName?: string
      name?: string
      webUrl?: string
    }>
  ) => {
    const times = 1
    const connection = await setSharePointConnection(agentId)
    mockSharePointOAuthTokenFetch(times)
    mockSharePointSitesFetch(sites, times)
    return connection
  }

  it("uploads and lists files attached to an agent", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Support Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    const autoKbScope = mockAutoKnowledgeBaseCreate()
    const ingestScope = mockGeminiIngest("gemini-file-1")

    const upload = await config.api.agent.uploadFile(
      created._id!,
      operationId,
      {
        file: fileBuffer,
        name: "notes.txt",
      }
    )
    expect(upload.file.status).toBe(KnowledgeBaseFileStatus.PROCESSING)

    await utils.queue.processMessages(getQueue().getBullQueue())
    expect(ingestScope.isDone()).toBe(true)
    expect(autoKbScope.isDone()).toBe(true)

    const { files } = await config.api.agent.fetchFiles(
      created._id!,
      operationId
    )
    expect(files).toHaveLength(1)
    expect(files[0].status).toBe(KnowledgeBaseFileStatus.READY)
    expect(files[0].filename).toBe("notes.txt")

    const refreshed = await config.api.agent.fetch()
    const saved = refreshed.agents.find(agent => agent._id === created._id)
    expect(saved?.operations?.[0]?.knowledgeBases?.length).toBe(1)
  })

  it("deletes an uploaded agent file", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Support Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    mockAutoKnowledgeBaseCreate()
    const ingestScope = mockGeminiIngest("gemini-file-2")
    const deleteScope = mockGeminiFileDelete("vector-store-1", "gemini-file-2")

    const upload = await config.api.agent.uploadFile(
      created._id!,
      operationId,
      {
        file: fileBuffer,
        name: "docs.txt",
      }
    )

    await utils.queue.processMessages(getQueue().getBullQueue())
    expect(ingestScope.isDone()).toBe(true)

    const response = await config.api.agent.removeFile(
      created._id!,
      operationId,
      upload.file._id!
    )
    expect(response.deleted).toBe(true)
    expect(deleteScope.isDone()).toBe(true)

    const { files } = await config.api.agent.fetchFiles(
      created._id!,
      operationId
    )
    expect(files).toHaveLength(0)
  })

  it("returns 403 when knowledge source downloads are disabled for the operation", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Restricted Downloads Agent",
        aiconfig: "default",
      },
      {
        ...operation,
        allowKnowledgeSourceDownload: false,
      }
    )
    const operationId = created.operations?.[0]?.id || operation.id

    mockAutoKnowledgeBaseCreate()
    mockGeminiIngest("gemini-file-download-blocked")

    const upload = await config.api.agent.uploadFile(
      created._id!,
      operationId,
      {
        file: fileBuffer,
        name: "restricted.txt",
      }
    )

    await utils.queue.processMessages(getQueue().getBullQueue())

    await config.api.agent.fetchFileUrl(
      created._id!,
      operationId,
      upload.file._id!,
      {
        status: 403,
        body: {
          message: "Knowledge source downloads are disabled for this operation",
        },
      }
    )
  })

  it("returns a file url when knowledge source downloads are allowed", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "Allowed Downloads Agent",
        aiconfig: "default",
      },
      { ...operation, allowKnowledgeSourceDownload: true }
    )
    const operationId = created.operations?.[0]?.id || operation.id

    mockAutoKnowledgeBaseCreate()
    mockGeminiIngest("gemini-file-download-allowed")

    const upload = await config.api.agent.uploadFile(
      created._id!,
      operationId,
      {
        file: fileBuffer,
        name: "allowed.txt",
      }
    )

    await utils.queue.processMessages(getQueue().getBullQueue())

    const response = await config.api.agent.fetchFileUrl(
      created._id!,
      operationId,
      upload.file._id!
    )

    expect(response.url).toEqual(expect.any(String))
    expect(response.url.length).toBeGreaterThan(0)
  })

  it("returns 400 when syncing SharePoint without a connected source", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    await config.api.agent.syncKnowledgeSources(
      created._id!,
      operationId,
      "site-1",
      undefined,
      {
        status: 400,
        body: {
          message: "SharePoint is not connected for this operation",
        },
      }
    )
  })

  it("queues SharePoint sync and returns accepted", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Async Sync Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id
    await setSharePointSourceInAgent(created._id!, ["site-1"])
    const queueAddSpy = jest.spyOn(knowledgeSourceSyncQueue.getQueue(), "add")

    const response = await config.api.agent.syncKnowledgeSources(
      created._id!,
      operationId,
      "sharepoint_site_site-1",
      undefined,
      { status: 202 }
    )

    expect(response).toEqual({
      agentId: created._id!,
      sourceId: "sharepoint_site_site-1",
      status: AgentKnowledgeSourceSyncRunStatus.QUEUED,
    })
    expect(queueAddSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        agentId: created._id!,
        sourceId: "sharepoint_site_site-1",
        jobType: "sync",
      }),
      expect.objectContaining({
        jobId: expect.stringContaining("_immediate"),
      })
    )
  })

  it("returns 400 when connecting a SharePoint site without a connected source", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Set Sites Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    await config.api.agent.connectSharePointSite(
      created._id!,
      operationId,
      {
        site: { id: "site-1" },
        datasourceId: "datasource-1",
        authConfigId: "auth-1",
      },
      {
        status: 400,
        body: {
          message: "SharePoint auth config not found.",
        },
      }
    )
  })

  it("persists submitted SharePoint metadata when the site listing omits the selected site", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Site Metadata Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id
    const connection = await setSharePointConnection(created._id!)
    mockSharePointOAuthTokenFetch(2)
    mockSharePointSitesFetch([], 2)

    await config.api.agent.connectSharePointSite(created._id!, operationId, {
      ...connection,
      site: {
        id: "contoso.sharepoint.com,site-id,web-id",
        name: "Product Documentation",
        webUrl: "https://example.com/sites/product-documentation",
      },
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const updated = await db.tryGet<Agent>(created._id!)
      const source = updated?.operations
        ?.find(operation => operation.id === operationId)
        ?.knowledgeSources?.find(
          source => source.type === AgentKnowledgeSourceType.SHAREPOINT
        )

      expect(source?.config.site).toEqual({
        id: "contoso.sharepoint.com,site-id,web-id",
        name: "Product Documentation",
        webUrl: "https://example.com/sites/product-documentation",
      })
    })
  })

  it("prefers current SharePoint metadata over submitted metadata", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Current Metadata Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id
    const connection = await setSharePointConnection(created._id!)
    mockSharePointOAuthTokenFetch(2)
    mockSharePointSitesFetch(
      [
        {
          id: "site-1",
          displayName: "Current Site Name",
          webUrl: "https://example.com/sites/current",
        },
      ],
      2
    )

    await config.api.agent.connectSharePointSite(created._id!, operationId, {
      ...connection,
      site: {
        id: "site-1",
        name: "Stale Site Name",
        webUrl: "https://example.com/sites/stale",
      },
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const updated = await db.tryGet<Agent>(created._id!)
      const source = updated?.operations
        ?.find(operation => operation.id === operationId)
        ?.knowledgeSources?.find(
          source => source.type === AgentKnowledgeSourceType.SHAREPOINT
        )

      expect(source?.config.site).toEqual({
        id: "site-1",
        name: "Current Site Name",
        webUrl: "https://example.com/sites/current",
      })
    })
  })

  it("rejects an empty SharePoint site id", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Empty Site Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    await config.api.agent.connectSharePointSite(
      created._id!,
      operationId,
      {
        site: { id: "" },
        datasourceId: "datasource-1",
        authConfigId: "auth-1",
      },
      { status: 400 }
    )
  })

  it("returns empty SharePoint sites for a connection without sites", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Sites Agent",
        aiconfig: "default",
      },
      operation
    )
    const connection = await setupSharePointKnowledgeOptionsFixture(
      created._id!,
      []
    )

    const response = await config.api.agent.fetchKnowledgeSourceOptions(
      connection.datasourceId,
      connection.authConfigId
    )

    expect(response.options).toEqual([])
  })

  it("returns only options for connection-scoped knowledge source options", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Options Shape Agent",
        aiconfig: "default",
      },
      operation
    )
    const connection = await setupSharePointKnowledgeOptionsFixture(
      created._id!,
      []
    )

    const response = await config.api.agent.fetchKnowledgeSourceOptions(
      connection.datasourceId,
      connection.authConfigId
    )

    expect(response).not.toHaveProperty("runs")
  })

  it("sync SharePoint with wrong source ids returns no-connection error", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Sync Empty Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    await config.api.agent.syncKnowledgeSources(
      created._id!,
      operationId,
      "wrongId",
      undefined,
      { status: 400 }
    )
  })

  it("ignores knowledge source changes via generic agent update", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Agent Update Guard",
        aiconfig: "default",
      },
      operation
    )

    await setSharePointSourceInAgent(created._id!, ["site-1"])

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const workspaceDb = context.getWorkspaceDB()
      const current = await workspaceDb.tryGet<Agent>(created._id!)
      expect(current).toBeDefined()

      const updated = await config.api.agent.update({
        ...current!,
        name: "SharePoint Agent Update Guard 2",
        knowledgeSources: [
          {
            id: "sharepoint_site_test",
            type: AgentKnowledgeSourceType.SHAREPOINT,
            config: {
              site: {
                id: "site-2",
              },
            },
          },
        ],
      } as any)

      expect(updated.name).toBe("SharePoint Agent Update Guard 2")

      const saved = await workspaceDb.tryGet<Agent>(created._id!)
      const siteIds = (saved?.operations || [])
        .flatMap(
          (operation: AgentOperation) => operation.knowledgeSources || []
        )
        .filter(source => source.type === AgentKnowledgeSourceType.SHAREPOINT)
        .map(source => source.config.site.id)
        .filter((id): id is string => !!id)
      expect(siteIds).toEqual(["site-1"])
    })
  })

  it("allows generic agent update when knowledge sources are unchanged", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Agent Update No Change",
        aiconfig: "default",
      },
      operation
    )

    await setSharePointSourceInAgent(created._id!, ["site-1"])

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const workspaceDb = context.getWorkspaceDB()
      const current = await workspaceDb.tryGet<Agent>(created._id!)
      expect(current).toBeDefined()

      const updated = await config.api.agent.update({
        ...current!,
        name: "SharePoint Agent Update No Change 2",
      } satisfies Agent)

      expect(updated.name).toBe("SharePoint Agent Update No Change 2")
    })
  })

  it("disconnect endpoint returns success and removes one SharePoint source", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Disconnect Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id

    await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])

    const response = await config.api.agent.disconnectSharePointSite(
      created._id!,
      operationId,
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
      const siteIds = (updated?.operations || [])
        .flatMap(
          (operation: AgentOperation) => operation.knowledgeSources || []
        )
        .filter(source => source.type === AgentKnowledgeSourceType.SHAREPOINT)
        .map(source => source.config.site.id)
        .filter((id): id is string => !!id)
      expect(siteIds).toEqual(["site-2"])
    })
  })

  it("returns SharePoint options with displayName and webUrl", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Options Agent",
        aiconfig: "default",
      },
      operation
    )

    const connection = await setupSharePointKnowledgeOptionsFixture(
      created._id!,
      [
        {
          id: "site-1",
          displayName: "Adria Site",
          name: "Legacy Name",
          webUrl: "https://contoso.sharepoint.com/sites/adria",
        },
      ]
    )

    const response = await config.api.agent.fetchKnowledgeSourceOptions(
      connection.datasourceId,
      connection.authConfigId
    )

    expect(response.options).toEqual([
      {
        id: "site-1",
        name: "Adria Site",
        webUrl: "https://contoso.sharepoint.com/sites/adria",
      },
    ])
  })

  it("disconnect endpoint enqueues cleanup for the removed site", async () => {
    const created = await config.api.agent.createWithOperation(
      {
        name: "SharePoint Disconnect Queue Agent",
        aiconfig: "default",
      },
      operation
    )
    const operationId = created.operations?.[0]?.id || operation.id
    await setSharePointSourceInAgent(created._id!, ["site-1", "site-2"])
    const queueAddSpy = jest.spyOn(knowledgeSourceSyncQueue.getQueue(), "add")

    await config.api.agent.disconnectSharePointSite(
      created._id!,
      operationId,
      "site-1"
    )

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
