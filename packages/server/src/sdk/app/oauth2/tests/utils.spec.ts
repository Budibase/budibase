import { generator } from "@budibase/backend-core/tests"
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers"
import sdk from "../../.."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { generateToken } from "../utils"
import path from "path"
import { KEYCLOCK_IMAGE } from "../../../../integrations/tests/utils/images"

const config = new TestConfiguration()

const volumePath = path.resolve(__dirname, "docker-volume")

jest.setTimeout(60000)

describe("oauth2 utils", () => {
  let container: StartedTestContainer

  let keycloakUrl: string

  beforeAll(async () => {
    await config.init()

    container = await new GenericContainer(KEYCLOCK_IMAGE)
      .withName("keycloak_testcontainer")
      .withReuse()
      .withExposedPorts(8080)
      .withBindMounts([
        { source: volumePath, target: "/opt/keycloak/data/import/" },
      ])
      .withCommand(["start-dev", "--import-realm"])
      .withWaitStrategy(Wait.forLogMessage("Listening on: http://0.0.0.0:8080"))
      .withStartupTimeout(60000)
      .start()

    keycloakUrl = `http://${container.getHost()}:${container.getMappedPort(
      8080
    )}`
  })

  describe("generateToken", () => {
    it("successfully generates tokens", async () => {
      const response = await config.doInContext(config.appId, async () => {
        const oauthConfig = await sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: "my-secret",
        })

        const response = await generateToken(oauthConfig.id)
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
          })

          await generateToken(oauthConfig.id)
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
          })

          await generateToken(oauthConfig.id)
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
          })

          await generateToken(oauthConfig.id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })
  })
})
