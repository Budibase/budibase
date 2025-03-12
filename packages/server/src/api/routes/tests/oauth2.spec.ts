import { CreateOAuth2ConfigRequest, VirtualDocumentType } from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"

describe("/oauth2", () => {
  let config = setup.getConfig()

  function makeOAuth2Config(): CreateOAuth2ConfigRequest {
    return {
      name: generator.guid(),
      url: generator.url(),
    }
  }

  beforeAll(async () => await config.init())

  beforeEach(async () => await config.newTenant())

  const expectOAuth2ConfigId = expect.stringMatching(
    `^${VirtualDocumentType.ROW_ACTION}_.+$`
  )

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
      await config.api.oauth2.create(oauth2Config, { status: 201 })

      const response = await config.api.oauth2.fetch()
      expect(response).toEqual({
        configs: [
          {
            id: expectOAuth2ConfigId,
            name: oauth2Config.name,
            url: oauth2Config.url,
          },
        ],
      })
    })

    it("can create multiple configurations", async () => {
      const oauth2Config = makeOAuth2Config()
      const oauth2Config2 = makeOAuth2Config()
      await config.api.oauth2.create(oauth2Config, { status: 201 })
      await config.api.oauth2.create(oauth2Config2, { status: 201 })

      const response = await config.api.oauth2.fetch()
      expect(response.configs).toEqual([
        {
          id: expectOAuth2ConfigId,
          name: oauth2Config.name,
          url: oauth2Config.url,
        },
        {
          id: expectOAuth2ConfigId,
          name: oauth2Config2.name,
          url: oauth2Config2.url,
        },
      ])
      expect(response.configs[0].id).not.toEqual(response.configs[1].id)
    })

    it("cannot create configurations with already existing names", async () => {
      const oauth2Config = makeOAuth2Config()
      const oauth2Config2 = { ...makeOAuth2Config(), name: oauth2Config.name }
      await config.api.oauth2.create(oauth2Config, { status: 201 })
      await config.api.oauth2.create(oauth2Config2, {
        status: 400,
        body: {
          message: "Name already used",
          status: 400,
        },
      })

      const response = await config.api.oauth2.fetch()
      expect(response.configs).toEqual([
        {
          id: expectOAuth2ConfigId,
          name: oauth2Config.name,
          url: oauth2Config.url,
        },
      ])
    })
  })
})
