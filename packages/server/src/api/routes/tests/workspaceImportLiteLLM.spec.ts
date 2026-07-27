import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import fs from "fs"
import os from "os"
import path from "path"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  AIConfigType,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
  DocumentType,
  LiteLLMKeyConfig,
} from "@budibase/types"
import nock from "nock"
import environment, { withEnv } from "../../../environment"
import sdk from "../../../sdk"
import { exportDB } from "../../../sdk/workspace/backups/exports"
import { DB_EXPORT_FILE } from "../../../sdk/workspace/backups/constants"
import * as tar from "tar"

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
      "gpt-4o-mini": { litellm_provider: "openai", mode: "chat" },
    })

const mockLiteLLMTeam = () =>
  nock(environment.LITELLM_URL)
    .persist()
    .post("/team/new")
    .reply(200, { team_id: "tenant-team-default" })

describe("workspace import LiteLLM scenarios", () => {
  const config = new TestConfiguration()

  async function createWorkspaceExportTar(workspaceId: string) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bb-import-lite-"))
    const dbPath = path.join(tempDir, DB_EXPORT_FILE)
    const tarPath = path.join(tempDir, "workspace-export.tar.gz")
    await exportDB(workspaceId, { exportPath: dbPath })
    await tar.create(
      {
        gzip: true,
        file: tarPath,
        cwd: tempDir,
      },
      [DB_EXPORT_FILE]
    )
    return {
      tarPath,
      tempDir,
    }
  }

  async function seedLiteLLMArtifacts(
    workspaceId: string,
    args: {
      configId: string
      modelId: string
      keyId: string
      provider?: string
      model?: string
      credentialsFields?: Record<string, string>
    }
  ) {
    await config.doInContext(workspaceId, async () => {
      const workspaceDb = context.getWorkspaceDB()
      await workspaceDb.put<CustomAIProviderConfig>({
        _id: args.configId,
        name: "Import Test Config",
        provider: args.provider ?? "OpenAI",
        model: args.model ?? "gpt-4o-mini",
        credentialsFields: args.credentialsFields ?? {
          api_key: "sk-test-key",
          api_base: "https://api.openai.com",
        },
        liteLLMModelId: args.modelId,
        configType: AIConfigType.COMPLETIONS,
      })
      await workspaceDb.put({
        _id: docIds.getLiteLLMKeyID(),
        keyId: args.keyId,
        secretKey: `${args.keyId}-secret`,
        teamId: "source-team-id",
      })
    })
  }

  async function getKeyDoc(workspaceId: string) {
    return config.doInContext(workspaceId, async () =>
      context
        .getWorkspaceDB()
        .tryGet<LiteLLMKeyConfig>(docIds.getLiteLLMKeyID())
    )
  }

  async function getFirstAIConfig(workspaceId: string) {
    return config.doInContext(workspaceId, async () =>
      db.doWithDB(workspaceId, async db => {
        const docs = await db.allDocs<CustomAIProviderConfig>(
          docIds.getDocParams(DocumentType.AI_CONFIG, undefined, {
            include_docs: true,
          })
        )
        return docs.rows[0].doc
      })
    )
  }

  function mockImportReconciliation(target: {
    modelId: string
    keyId: string
  }) {
    nock(environment.LITELLM_URL)
      .post("/model/new")
      .reply(200, { model_id: target.modelId })
      .post("/key/generate")
      .reply(200, { token_id: target.keyId, key: `${target.keyId}-secret` })
      .post("/key/update")
      .reply(200, { status: "success" })
  }

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
    nock.cleanAll()
    mockLiteLLMProviders()
    mockLiteLLMModelCostMap()
    mockLiteLLMTeam()
  })

  afterAll(async () => {
    config.end()
  })

  it("creates a new key and LiteLLM models when creating a workspace from an import", async () => {
    await withEnv({ LITELLM_MASTER_KEY: "test-master-key" }, async () => {
      const sourceWorkspaceId = config.getDevWorkspaceId()
      const sourceConfigId = docIds.generateAIConfigID()
      await seedLiteLLMArtifacts(sourceWorkspaceId, {
        configId: sourceConfigId,
        modelId: "source-model-id-1",
        keyId: "source-key-1",
      })

      const { tarPath, tempDir } =
        await createWorkspaceExportTar(sourceWorkspaceId)
      try {
        mockImportReconciliation({
          modelId: "new-workspace-model-id",
          keyId: "new-workspace-key-id",
        })

        const createdWorkspace = await config.api.workspace.create({
          name: "Imported New Workspace",
        })
        const targetWorkspaceId = createdWorkspace.appId!

        await config.doInContext(targetWorkspaceId, async () => {
          await sdk.backups.importApp(
            targetWorkspaceId,
            db.getDB(targetWorkspaceId),
            {
              file: {
                type: "application/gzip",
                path: tarPath,
              },
            },
            {
              updateAttachmentColumns: false,
              importObjStoreContents: false,
            }
          )
        })

        const importedKeyDoc = await getKeyDoc(targetWorkspaceId)
        const importedConfig = await getFirstAIConfig(targetWorkspaceId)

        expect(importedKeyDoc?.keyId).toBe("new-workspace-key-id")
        expect(importedConfig?._id).toBe(sourceConfigId)
        expect(importedConfig?.liteLLMModelId).toBe("new-workspace-model-id")
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })
  })

  it("ensures key and models exist when updating a workspace", async () => {
    await withEnv({ LITELLM_MASTER_KEY: "test-master-key" }, async () => {
      const workspaceId = config.getDevWorkspaceId()
      const configId = docIds.generateAIConfigID()
      await seedLiteLLMArtifacts(workspaceId, {
        configId,
        modelId: "same-workspace-source-model",
        keyId: "same-workspace-source-key",
      })

      const { tarPath, tempDir } = await createWorkspaceExportTar(workspaceId)
      try {
        mockImportReconciliation({
          modelId: "same-workspace-model-id",
          keyId: "same-workspace-key-id",
        })

        await config.doInContext(workspaceId, async () => {
          await sdk.backups.importApp(
            workspaceId,
            db.getDB(workspaceId),
            {
              file: {
                type: "application/gzip",
                path: tarPath,
              },
            },
            {
              updateAttachmentColumns: false,
              importObjStoreContents: false,
            }
          )
        })

        const importedKeyDoc = await getKeyDoc(workspaceId)
        const importedConfig = await getFirstAIConfig(workspaceId)

        expect(importedKeyDoc?.keyId).toBeTruthy()
        expect(importedConfig?.liteLLMModelId).toBeTruthy()
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })
  })

  it("creates new key and LiteLLM models when importing a workspace to another workspace", async () => {
    await withEnv({ LITELLM_MASTER_KEY: "test-master-key" }, async () => {
      const sourceWorkspaceId = config.getDevWorkspaceId()
      const sourceConfigId = docIds.generateAIConfigID()
      await seedLiteLLMArtifacts(sourceWorkspaceId, {
        configId: sourceConfigId,
        modelId: "source-model-id-3",
        keyId: "source-key-3",
      })

      const { tarPath, tempDir } =
        await createWorkspaceExportTar(sourceWorkspaceId)
      const sourceKeyDoc = await getKeyDoc(sourceWorkspaceId)
      if (!sourceKeyDoc) {
        throw new HTTPError("Source key doc not found", 500)
      }

      const targetWorkspace = await config.api.workspace.create({
        name: "Import target workspace 3",
      })
      const targetWorkspaceId = targetWorkspace.appId!
      try {
        mockImportReconciliation({
          modelId: "different-workspace-model-id",
          keyId: "different-workspace-key-id",
        })

        await config.doInContext(targetWorkspaceId, async () => {
          await sdk.backups.importApp(
            targetWorkspaceId,
            db.getDB(targetWorkspaceId),
            {
              file: {
                type: "application/gzip",
                path: tarPath,
              },
            },
            {
              updateAttachmentColumns: false,
              importObjStoreContents: false,
            }
          )
        })

        const importedKeyDoc = await getKeyDoc(targetWorkspaceId)
        const importedConfig = await getFirstAIConfig(targetWorkspaceId)

        expect(importedKeyDoc?.keyId).toBe("different-workspace-key-id")
        expect(importedKeyDoc?.keyId).not.toBe(sourceKeyDoc.keyId)
        expect(importedConfig?._id).toBe(sourceConfigId)
        expect(importedConfig?.liteLLMModelId).toBe(
          "different-workspace-model-id"
        )
        expect(importedConfig?.liteLLMModelId).not.toBe("source-model-id-3")
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })
  })

  it("preserves Budibase AI model id on cloud imports", async () => {
    await withEnv(
      { LITELLM_MASTER_KEY: undefined, SELF_HOSTED: "false" },
      async () => {
        const sourceWorkspaceId = config.getDevWorkspaceId()
        const sourceConfigId = docIds.generateAIConfigID("bbai")
        await seedLiteLLMArtifacts(sourceWorkspaceId, {
          configId: sourceConfigId,
          modelId: BUDIBASE_AI_PROVIDER_ID,
          keyId: "source-key-bbai",
          provider: BUDIBASE_AI_PROVIDER_ID,
          model: "gpt-4o-mini",
          credentialsFields: {},
        })

        const { tarPath, tempDir } =
          await createWorkspaceExportTar(sourceWorkspaceId)
        try {
          const targetWorkspace = await config.api.workspace.create({
            name: "Import target workspace bbai cloud",
          })

          await config.doInContext(targetWorkspace.appId!, async () => {
            await sdk.backups.importApp(
              targetWorkspace.appId!,
              db.getDB(targetWorkspace.appId!),
              {
                file: {
                  type: "application/gzip",
                  path: tarPath,
                },
              },
              {
                updateAttachmentColumns: false,
                importObjStoreContents: false,
              }
            )
          })

          const importedConfig = await getFirstAIConfig(targetWorkspace.appId!)
          expect(importedConfig?.provider).toBe(BUDIBASE_AI_PROVIDER_ID)
          expect(importedConfig?.liteLLMModelId).toBe(BUDIBASE_AI_PROVIDER_ID)
        } finally {
          fs.rmSync(tempDir, { recursive: true, force: true })
        }
      }
    )
  })
})
