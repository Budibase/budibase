import {
  OAuth2Config,
  UpsertOAuth2ConfigRequest,
  VirtualDocumentType,
} from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"
import _ from "lodash/fp"
import sdk from "packages/server/src/sdk"

describe("/oauth2", () => {
  let config = setup.getConfig()

  function makeOAuth2Config(): UpsertOAuth2ConfigRequest {
    return {
      name: generator.guid(),
      url: generator.url(),
      clientId: generator.guid(),
      clientSecret: generator.hash(),
    }
  }

  beforeAll(async () => await config.init())

  const expectOAuth2ConfigId = expect.stringMatching(
    `^${VirtualDocumentType.OAUTH2_CONFIG}_.+$`
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
    beforeEach(async () => await config.newTenant())

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

  describe("update", () => {
    let existingConfigs: OAuth2Config[] = []

    beforeAll(async () => {
      await config.newTenant()

      for (let i = 0; i < 10; i++) {
        const oauth2Config = makeOAuth2Config()
        const result = await config.api.oauth2.create(makeOAuth2Config())

        existingConfigs.push({ ...oauth2Config, id: result.config.id })
      }
    })

    it("can update an existing configuration", async () => {
      const { id: configId, ...configData } = _.sample(existingConfigs)!

      await config.api.oauth2.update(configId, {
        ...configData,
        name: "updated name",
      })

      const response = await config.api.oauth2.fetch()
      expect(response.configs).toHaveLength(existingConfigs.length)
      expect(response.configs).toEqual(
        expect.arrayContaining([
          {
            id: configId,
            name: "updated name",
            url: configData.url,
          },
        ])
      )
    })
  })
})
