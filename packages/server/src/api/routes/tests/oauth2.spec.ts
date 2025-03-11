import { CreateOAuth2ConfigRequest } from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"

describe("/oauth2", () => {
  let config = setup.getConfig()

  function makeOAuth2Config(): CreateOAuth2ConfigRequest {
    return {
      name: generator.guid(),
    }
  }

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch", () => {
    it("returns empty when no oauth are created", async () => {
      const response = await config.api.oauth2.fetch()
      expect(response).toEqual({
        configs: [],
      })
    })
  })

  describe("create", () => {
    it("can create a new configuration", async () => {
      const oauth2Config = makeOAuth2Config()
      await config.api.oauth2.create(oauth2Config, {
        status: 201,
      })

      const response = await config.api.oauth2.fetch()
      expect(response).toEqual({
        configs: [
          {
            name: oauth2Config.name,
          },
        ],
      })
    })
  })
})
