jest.mock("../../../integrations/postgres")
import * as setup from "./utilities"
import postgres from "../../../integrations/postgres"
import { mocks } from "@budibase/backend-core/tests"
import { env } from "@budibase/backend-core"
const structures = setup.structures

env._set("ENCRYPTION_KEY", "budibase")
mocks.licenses.useEnvironmentVariables()

describe("/api/env/variables", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
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

  it("should be able to update the environment variable 'test'", async () => {})

  it("should be able to delete the environment variable 'test'", async () => {})

  it("should be able to create an environment variable", async () => {})

  it("should create a datasource (using the environment variable) and query", async () => {
    const datasourceBase = structures.basicDatasource()
    // TODO: we need to use an environment variable in the datasource configuration
    const datasource = await request
      .post(`/api/datasources`)
      .send(datasourceBase)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(datasource._id).toBeDefined()

    const query = await request
      .post(`/api/queries`)
      .send(structures.basicQuery(datasource._id))
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    expect(query._id).toBeDefined()
  })

  it("should run a query preview and check the mocked results", async () => {
    // TODO: use the preview API
    expect(postgres.integration).toHaveBeenCalledWith()
  })
})
