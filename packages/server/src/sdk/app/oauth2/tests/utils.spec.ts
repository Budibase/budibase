import { generator, utils as testUtils } from "@budibase/backend-core/tests"
import { GenericContainer, Wait } from "testcontainers"
import sdk from "../../.."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { getToken } from "../utils"
import path from "path"
import { KEYCLOAK_IMAGE } from "../../../../integrations/tests/utils/images"
import { startContainer } from "../../../../integrations/tests/utils"
import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import { cache } from "@budibase/backend-core"
import tk from "timekeeper"

const config = new TestConfiguration()

const volumePath = path.resolve(__dirname, "docker-volume")

jest.setTimeout(60000)

describe("oauth2 utils", () => {
  let keycloakUrl: string

  beforeAll(async () => {
    await config.init()

    const ports = await startContainer(
      new GenericContainer(KEYCLOAK_IMAGE)
        .withName("keycloak_testcontainer")
        .withExposedPorts(8080)
        .withBindMounts([
          { source: volumePath, target: "/opt/keycloak/data/import/" },
        ])
        .withCommand(["start-dev", "--import-realm"])
        .withWaitStrategy(
          Wait.forLogMessage("Listening on: http://0.0.0.0:8080")
        )
        .withStartupTimeout(60000)
    )

    const port = ports.find(x => x.container === 8080)?.host
    if (!port) {
      throw new Error("Keycloak port not found")
    }

    keycloakUrl = `http://127.0.0.1:${port}`
  })

  describe.each(
    Object.values(OAuth2CredentialsMethod).flatMap(method =>
      Object.values(OAuth2GrantType).map<
        [OAuth2CredentialsMethod, OAuth2GrantType]
      >(grantType => [method, grantType])
    )
  )("generateToken (in %s, grant type %s)", (method, grantType) => {
    it("successfully generates tokens", async () => {
      const response = await config.doInContext(config.appId, async () => {
        const oauthConfig = await sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: "my-secret",
          method,
          grantType,
        })

        const response = await getToken(oauthConfig._id)
        return response
      })

      expect(response).toEqual(expect.stringMatching(/^Bearer .+/))
    })

    it("uses cached value if available", async () => {
      const oauthConfig = await config.doInContext(config.appId, () =>
        sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: "my-secret",
          method,
          grantType,
        })
      )

      const firstToken = await config.doInContext(config.appId, () =>
        getToken(oauthConfig._id)
      )
      const secondToken = await config.doInContext(config.appId, () =>
        getToken(oauthConfig._id)
      )

      expect(firstToken).toEqual(secondToken)
    })

    it("refetches value if cache expired", async () => {
      const oauthConfig = await config.doInContext(config.appId, () =>
        sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: "my-secret",
          method,
          grantType,
        })
      )

      const firstToken = await config.doInContext(config.appId, () =>
        getToken(oauthConfig._id)
      )
      await config.doInContext(config.appId, () =>
        sdk.oauth2.cleanStoredToken(oauthConfig._id)
      )
      const secondToken = await config.doInContext(config.appId, () =>
        getToken(oauthConfig._id)
      )

      expect(firstToken).not.toEqual(secondToken)
    })

    it("handles wrong urls", async () => {
      await expect(
        config.doInContext(config.appId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/wrong/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: "my-secret",
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow("Error fetching oauth2 token: Not Found")
    })

    it("handles wrong client ids", async () => {
      await expect(
        config.doInContext(config.appId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "wrong-client-id",
            clientSecret: "my-secret",
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })

    it("handles wrong secrets", async () => {
      await expect(
        config.doInContext(config.appId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: "wrong-secret",
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })

    describe("track usages", () => {
      beforeAll(() => {
        tk.freeze(Date.now())
      })

      it("tracks usages on generation", async () => {
        const oauthConfig = await config.doInContext(config.appId, () =>
          sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: "my-secret",
            method,
            grantType,
          })
        )

        await config.doInContext(config.appId, () => getToken(oauthConfig._id))
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        const usageLog = await config.doInContext(config.appId, () =>
          sdk.oauth2.getLastUsages([oauthConfig._id])
        )

        expect(usageLog[oauthConfig._id]).toEqual(Date.now())
      })

      it("does not track on failed usages", async () => {
        const oauthConfig = await config.doInContext(config.appId, () =>
          sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "wrong-client",
            clientSecret: "my-secret",
            method,
            grantType,
          })
        )

        await expect(
          config.doInContext(config.appId, () => getToken(oauthConfig._id))
        ).rejects.toThrow()
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        const usageLog = await config.doInContext(config.appId, () =>
          sdk.oauth2.getLastUsages([oauthConfig._id])
        )

        expect(usageLog[oauthConfig._id]).toBeUndefined()
      })

      it("tracks usages between prod and dev, keeping always the latest", async () => {
        const oauthConfig = await config.doInContext(config.appId, () =>
          sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: "my-secret",
            method,
            grantType,
          })
        )

        await config.doInContext(config.appId, () => getToken(oauthConfig._id))

        await config.publish()

        tk.travel(Date.now() + 100)
        await config.doInContext(config.prodAppId, () =>
          getToken(oauthConfig._id)
        )
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        for (const appId of [config.appId, config.prodAppId]) {
          const usageLog = await config.doInContext(appId, () =>
            sdk.oauth2.getLastUsages([oauthConfig._id])
          )

          expect(usageLog).toEqual({
            [oauthConfig._id]: Date.now(),
          })
        }
      })
    })
  })
})
