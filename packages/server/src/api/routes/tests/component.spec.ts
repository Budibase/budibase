import * as env from "../../../environment"
import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

describe("/component", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch definitions", () => {
    it("should be able to fetch definitions locally", async () => {
      await env.withEnv(
        {
          DEV_USE_CLIENT_FROM_STORAGE: "0",
        },
        async () => {
          const res = await request
            .get(`/api/${config.getAppId()}/components/definitions`)
            .set(config.defaultHeaders())
            .expect("Content-Type", /json/)
            .expect(200)
          expect(
            res.body["@budibase/standard-components/container"]
          ).toBeDefined()
        }
      )
    })

    it("should be able to fetch definitions from object store", async () => {
      await env.withEnv(
        {
          DEV_USE_CLIENT_FROM_STORAGE: "1",
        },
        async () => {
          // init again to make an app with a real component lib
          await config.init()
          const res = await request
            .get(`/api/${config.getAppId()}/components/definitions`)
            .set(config.defaultHeaders())
            .expect("Content-Type", /json/)
            .expect(200)
          expect(
            res.body["@budibase/standard-components/container"]
          ).toBeDefined()
        }
      )
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/${config.getAppId()}/components/definitions`,
      })
    })
  })
})
