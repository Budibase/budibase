import {
  OAuth2Config,
  OAuth2CredentialsMethod,
  PASSWORD_REPLACEMENT,
  UpsertOAuth2ConfigRequest,
  VirtualDocumentType,
} from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"
import _ from "lodash/fp"

describe("/oauth2", () => {
  let config = setup.getConfig()

  function makeOAuth2Config(): UpsertOAuth2ConfigRequest {
    return {
      name: generator.guid(),
      url: generator.url(),
      clientId: generator.guid(),
      clientSecret: generator.hash(),
      method: generator.pickone(Object.values(OAuth2CredentialsMethod)),
    }
  }

  beforeAll(async () => await config.init())

  beforeEach(async () => await config.newTenant())

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

    it("returns all created configs", async () => {
      const existingConfigs = []
      for (let i = 0; i < 10; i++) {
        const oauth2Config = makeOAuth2Config()
        const result = await config.api.oauth2.create(oauth2Config)
        existingConfigs.push({ ...oauth2Config, id: result.config.id })
      }

      const response = await config.api.oauth2.fetch()
      expect(response.configs).toHaveLength(existingConfigs.length)
      expect(response).toEqual({
        configs: expect.arrayContaining(
          existingConfigs.map(c => ({
            id: c.id,
            name: c.name,
            url: c.url,
            clientId: c.clientId,
            clientSecret: PASSWORD_REPLACEMENT,
            method: c.method,
          }))
        ),
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
            clientId: oauth2Config.clientId,
            clientSecret: PASSWORD_REPLACEMENT,
            method: oauth2Config.method,
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
          clientId: oauth2Config.clientId,
          clientSecret: PASSWORD_REPLACEMENT,
          method: oauth2Config.method,
        },
        {
          id: expectOAuth2ConfigId,
          name: oauth2Config2.name,
          url: oauth2Config2.url,
          clientId: oauth2Config2.clientId,
          clientSecret: PASSWORD_REPLACEMENT,
          method: oauth2Config2.method,
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
          clientId: oauth2Config.clientId,
          clientSecret: PASSWORD_REPLACEMENT,
          method: oauth2Config.method,
        },
      ])
    })
  })

  describe("update", () => {
    let existingConfigs: OAuth2Config[] = []

    beforeEach(async () => {
      existingConfigs = []
      for (let i = 0; i < 10; i++) {
        const oauth2Config = makeOAuth2Config()
        const result = await config.api.oauth2.create(oauth2Config)

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
            clientId: configData.clientId,
            clientSecret: PASSWORD_REPLACEMENT,
            method: configData.method,
          },
        ])
      )
    })

    it("throw if config not found", async () => {
      await config.api.oauth2.update("unexisting", makeOAuth2Config(), {
        status: 404,
        body: { message: "OAuth2 config with id 'unexisting' not found." },
      })
    })

    it("throws if trying to use an existing name", async () => {
      const [config1, config2] = _.sampleSize(2, existingConfigs)
      const { id: configId, ...configData } = config1

      await config.api.oauth2.update(
        configId,
        {
          ...configData,
          name: config2.name,
        },
        {
          status: 400,
          body: {
            message: `OAuth2 config with name '${config2.name}' is already taken.`,
          },
        }
      )
    })
  })

  describe("delete", () => {
    let existingConfigs: OAuth2Config[] = []

    beforeEach(async () => {
      existingConfigs = []
      for (let i = 0; i < 5; i++) {
        const oauth2Config = makeOAuth2Config()
        const result = await config.api.oauth2.create(oauth2Config)

        existingConfigs.push({ ...oauth2Config, id: result.config.id })
      }
    })

    it("can delete an existing configuration", async () => {
      const { id: configId } = _.sample(existingConfigs)!

      await config.api.oauth2.delete(configId, { status: 204 })

      const response = await config.api.oauth2.fetch()
      expect(response.configs).toHaveLength(existingConfigs.length - 1)
      expect(response.configs.find(c => c.id === configId)).toBeUndefined()
    })

    it("throw if config not found", async () => {
      await config.api.oauth2.delete("unexisting", {
        status: 404,
        body: { message: "OAuth2 config with id 'unexisting' not found." },
      })
    })
  })
})
