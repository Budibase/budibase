import { generator } from "@budibase/backend-core/tests"
import { SourceName } from "@budibase/types"
import * as setup from "../../tests/utilities"
import { generateMakeRequest } from "./utils"

describe("public query search", () => {
  const config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(setup.afterAll)

  it("does not disclose saved REST request credentials", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {},
    })
    const name = `credential probe ${generator.guid()}`
    await config.api.query.save({
      name,
      datasourceId: datasource._id!,
      parameters: [],
      fields: {
        method: "GET",
        path: "/repos",
        headers: {
          Authorization: "Bearer example-canary",
          "X-Api-Key": "example-api-key-canary",
          "Content-Type": "application/json",
        },
      },
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })

    const apiKey = await config.generateApiKey()
    const makeRequest = generateMakeRequest(apiKey)
    const result = await makeRequest("post", "/queries/search", { name })

    expect(result.status).toBe(200)
    expect(result.body.data).toHaveLength(1)
    expect(result.body.data[0]).toMatchObject({
      name,
      fields: {
        method: "GET",
        path: "/repos",
      },
    })
    expect(result.body.data[0].fields).not.toHaveProperty("headers")
    expect(JSON.stringify(result.body)).not.toContain("example-canary")
    expect(JSON.stringify(result.body)).not.toContain("example-api-key-canary")

    const noMatch = await makeRequest("post", "/queries/search", {
      name: `missing ${generator.guid()}`,
    })
    expect(noMatch.status).toBe(200)
    expect(noMatch.body.data).toEqual([])
  })
})
