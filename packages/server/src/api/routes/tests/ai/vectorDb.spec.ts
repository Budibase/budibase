import { PASSWORD_REPLACEMENT } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const config = new TestConfiguration()

describe("vector db configs", () => {
  const vectorDbRequest = {
    name: "Primary Vector DB",
    provider: "pgvector",
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
    const created = await config.api.vectorDb.create(vectorDbRequest)
    expect(created._id).toBeDefined()
    expect(created.password).toBe(PASSWORD_REPLACEMENT)

    const configs = await config.api.vectorDb.fetch()
    expect(configs).toHaveLength(1)
    expect(configs[0].name).toBe(vectorDbRequest.name)
    expect(configs[0].password).toBe(PASSWORD_REPLACEMENT)
  })

  it("updates and deletes vector db configs", async () => {
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

  it("rejects unsupported providers", async () => {
    await config.api.vectorDb.create(
      {
        ...vectorDbRequest,
        provider: "pinecone",
      },
      { status: 400 }
    )
  })
})
