import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as env from "../../../environment"
import * as setup from "./utilities"

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
          USE_LOCAL_COMPONENT_LIBS: "1",
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
          USE_LOCAL_COMPONENT_LIBS: "0",
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
