const pg = require("pg")

jest.mock("pg", () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      query: jest.fn().mockImplementation(() => ({ rows: [] })),
      end: jest.fn().mockImplementation((fn: any) => fn()),
    })),
    queryMock: jest.fn().mockImplementation(() => {}),
    on: jest.fn(),
  }
})
import * as setup from "./utilities"
import { mocks } from "@budibase/backend-core/tests"
import { env, events } from "@budibase/backend-core"
import { QueryPreview } from "@budibase/types"

const structures = setup.structures

env._set("ENCRYPTION_KEY", "budibase")
mocks.licenses.useEnvironmentVariables()

describe("/api/env/variables", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  it("should be able check the status of env var API", async () => {
    const res = await request
      .get(`/api/env/variables/status`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    expect(res.body.encryptionKeyAvailable).toEqual(true)
  })

  it("should be able to create an environment variable", async () => {
    await request
      .post(`/api/env/variables`)
      .send(structures.basicEnvironmentVariable("test", "test"))
      .set(config.defaultHeaders())
      .expect(200)
  })

  it("should be able to fetch the 'test' variable name", async () => {
    const res = await request
      .get(`/api/env/variables`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.variables.length).toEqual(1)
    expect(res.body.variables[0]).toEqual("test")
  })

  it("should be able to update the environment variable 'test'", async () => {
    const varName = "test"
    await request
      .patch(`/api/env/variables/${varName}`)
      .send(structures.basicEnvironmentVariable("test", "test1"))
      .set(config.defaultHeaders())
      .expect(200)
  })

  it("should be able to delete the environment variable 'test'", async () => {
    const varName = "test"
    await request
      .delete(`/api/env/variables/${varName}`)
      .set(config.defaultHeaders())
      .expect(200)
  })

  it("should create a datasource (using the environment variable) and query", async () => {
    const datasourceBase = structures.basicDatasource()
    await request
      .post(`/api/env/variables`)
      .send(structures.basicEnvironmentVariable("test", "test"))
      .set(config.defaultHeaders())

    datasourceBase.datasource.config = {
      password: "{{ env.test }}",
    }
    const response = await request
      .post(`/api/datasources`)
      .send(datasourceBase)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(response.body.datasource._id).toBeDefined()

    const response2 = await request
      .post(`/api/queries`)
      .send(structures.basicQuery(response.body.datasource._id))
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(response2.body._id).toBeDefined()
  })

  it("should run a query preview and check the mocked results", async () => {
    const datasourceBase = structures.basicDatasource()
    await request
      .post(`/api/env/variables`)
      .send(structures.basicEnvironmentVariable("test", "test"))
      .set(config.defaultHeaders())

    datasourceBase.datasource.config = {
      password: "{{ env.test }}",
    }
    const response = await request
      .post(`/api/datasources`)
      .send(datasourceBase)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(response.body.datasource._id).toBeDefined()

    const queryPreview: QueryPreview = {
      datasourceId: response.body.datasource._id,
      parameters: [],
      fields: {},
      queryVerb: "read",
      name: response.body.datasource.name,
      transformer: null,
      schema: {},
      readable: true,
    }
    const res = await request
      .post(`/api/queries/preview`)
      .send(queryPreview)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(res.body.rows.length).toEqual(0)
    expect(events.query.previewed).toHaveBeenCalledTimes(1)
    // API doesn't include config in response
    delete response.body.datasource.config
    expect(events.query.previewed).toHaveBeenCalledWith(
      response.body.datasource,
      {
        ...queryPreview,
        nullDefaultSupport: true,
      }
    )
    expect(pg.Client).toHaveBeenCalledWith({ password: "test", ssl: undefined })
  })
})
