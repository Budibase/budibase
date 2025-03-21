import { generator, utils as testUtils } from "@budibase/backend-core/tests"
import { GenericContainer, Wait } from "testcontainers"
import sdk from "../../.."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { getToken } from "../utils"
import path from "path"
import { KEYCLOAK_IMAGE } from "../../../../integrations/tests/utils/images"
import { startContainer } from "../../../../integrations/tests/utils"
import { OAuth2CredentialsMethod } from "@budibase/types"
import { cache, context, docIds } from "@budibase/backend-core"
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

  describe.each(Object.values(OAuth2CredentialsMethod))(
    "getToken (in %s)",
    method => {
      it("successfully generates tokens", async () => {
        const response = await config.doInContext(config.appId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: "my-secret",
            method,
          })

          const response = await getToken(oauthConfig._id)
          return response
        })

        expect(response).toEqual(expect.stringMatching(/^Bearer .+/))
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
            })
          )

          await config.doInContext(config.appId, () => getToken(oauthConfig.id))
          await testUtils.queue.processMessages(
            cache.docWritethrough.DocWritethroughProcessor.queue
          )

          const usageLog = await config.doInContext(config.appId, () =>
            context
              .getAppDB()
              .tryGet(docIds.generateOAuth2LogID(oauthConfig.id))
          )

          expect(usageLog).toEqual(
            expect.objectContaining({
              lastUsage: Date.now(),
            })
          )
        })

        it("does not track on failed usages", async () => {
          const oauthConfig = await config.doInContext(config.appId, () =>
            sdk.oauth2.create({
              name: generator.guid(),
              url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
              clientId: "wrong-client",
              clientSecret: "my-secret",
              method,
            })
          )

          await expect(
            config.doInContext(config.appId, () => getToken(oauthConfig.id))
          ).rejects.toThrow()
          await testUtils.queue.processMessages(
            cache.docWritethrough.DocWritethroughProcessor.queue
          )

          const usageLog = await config.doInContext(config.appId, () =>
            context
              .getAppDB()
              .tryGet(docIds.generateOAuth2LogID(oauthConfig.id))
          )

          expect(usageLog).toBeUndefined()
        })
      })
    }
  )
})
