import { features } from "@budibase/backend-core"
import {
  FeatureFlag,
  PASSWORD_REPLACEMENT,
  VectorDbProvider,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { validatePgVectorDbConfig } from "../../../../sdk/workspace/ai/vectorDb/pgVectorDb"
import { mocks } from "@budibase/backend-core/tests"

jest.mock("../../../../sdk/workspace/ai/vectorDb/pgVectorDb", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/vectorDb/pgVectorDb"
  )
  return {
    ...actual,
    validatePgVectorDbConfig: jest.fn().mockResolvedValue(undefined),
  }
})

jest.mock("../../../../sdk/workspace/ai/knowledgeBase/geminiFileStore", () => {
  const actual = jest.requireActual(
    "../../../../sdk/workspace/ai/knowledgeBase/geminiFileStore"
  )
  return {
    ...actual,
    createGeminiFileStore: jest.fn().mockResolvedValue("gemini_store_test"),
  }
})

describe("vector db configs", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withRagEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )
  }

  const withRagDisabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: false },
      f
    )
  }

  const vectorDbRequest = {
    name: "Primary Vector DB",
    provider: VectorDbProvider.PGVECTOR,
    host: "localhost",
    port: 5432,
    database: "budibase",
    user: "bb_user",
    password: "secret",
  }

  beforeEach(async () => {
    mocks.licenses.useCloudFree()
    await config.newTenant()
    jest.clearAllMocks()
  })

  it("creates and lists vector db configs", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.vectorDb.create(vectorDbRequest)
      expect(created._id).toBeDefined()
      expect(created.password).toBe(PASSWORD_REPLACEMENT)

      const configs = await config.api.vectorDb.fetch()
      expect(configs).toHaveLength(1)
      expect(configs[0].name).toBe(vectorDbRequest.name)
      expect(configs[0].password).toBe(PASSWORD_REPLACEMENT)
    })
  })

  it("updates and deletes vector db configs", async () => {
    await withRagEnabled(async () => {
      const created = await config.api.vectorDb.create(vectorDbRequest)

      const updated = await config.api.vectorDb.update({
        ...created,
        name: "Updated Vector DB",
        password: PASSWORD_REPLACEMENT,
      })
      expect(updated.name).toBe("Updated Vector DB")
      expect(updated.password).toBe(PASSWORD_REPLACEMENT)

      const { deleted } = await config.api.vectorDb.remove(created._id!)
      expect(deleted).toBe(true)

      const configs = await config.api.vectorDb.fetch()
      expect(configs).toHaveLength(0)
    })
  })

  it("resolves environment variable vector db settings before validating and preserves env passwords in responses", async () => {
    mocks.licenses.useEnvironmentVariables()
    await withRagEnabled(async () => {
      await config.api.environment.create({
        name: "pg_host",
        production: "prod-db.internal",
        development: "dev-db.internal",
      })
      await config.api.environment.create({
        name: "pg_port",
        production: "6432",
        development: "5433",
      })
      await config.api.environment.create({
        name: "pg_password",
        production: "prod-secret",
        development: "dev-secret",
      })

      const created = await config.api.vectorDb.create({
        ...vectorDbRequest,
        host: "{{ env.pg_host }}",
        port: "{{ env.pg_port }}",
        password: "{{ env.pg_password }}",
      })

      expect(validatePgVectorDbConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          host: "dev-db.internal",
          port: 5433,
          password: "dev-secret",
          user: "bb_user",
          database: "budibase",
        })
      )
      expect(created.password).toBe("{{ env.pg_password }}")

      const configs = await config.api.vectorDb.fetch()
      expect(configs[0].password).toBe("{{ env.pg_password }}")
    })
  })

  it("rejects unsupported providers", async () => {
    await withRagEnabled(async () => {
      await config.api.vectorDb.create(
        {
          ...vectorDbRequest,
          provider: "pinecone" as VectorDbProvider,
        },
        { status: 400 }
      )
    })
  })

  it("returns 403 when RAG is disabled", async () => {
    await withRagDisabled(async () => {
      await config.api.vectorDb.fetch({ status: 403 })
      await config.api.vectorDb.create(vectorDbRequest, { status: 403 })
      await config.api.vectorDb.update(
        {
          _id: "vectordb_test",
          _rev: "1-test",
          ...vectorDbRequest,
        },
        { status: 403 }
      )
      await config.api.vectorDb.remove("vectordb_test", { status: 403 })
    })
  })
})
