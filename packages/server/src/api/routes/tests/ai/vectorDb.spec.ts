import { features } from "@budibase/backend-core"
import {
  FeatureFlag,
  PASSWORD_REPLACEMENT,
  VectorDbProvider,
} from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

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
    await config.newTenant()
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
})
