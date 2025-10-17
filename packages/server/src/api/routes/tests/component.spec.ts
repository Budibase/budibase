import { features } from "@budibase/backend-core"
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
      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        {
          DEV_USE_CLIENT_FROM_STORAGE: false,
        },
        async () => {
          const res = await request
            .get(`/api/${config.getDevWorkspaceId()}/components/definitions`)
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
      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        {
          DEV_USE_CLIENT_FROM_STORAGE: true,
        },
        async () => {
          // init again to make an app with a real component lib
          await config.init()
          const res = await request
            .get(`/api/${config.getDevWorkspaceId()}/components/definitions`)
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
        url: `/api/${config.getDevWorkspaceId()}/components/definitions`,
      })
    })
  })
})
