import { generator } from "@budibase/backend-core/tests"
import { GenericContainer, Wait } from "testcontainers"
import sdk from "../../.."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { generateToken } from "../utils"
import path from "path"
import { KEYCLOAK_IMAGE } from "../../../../integrations/tests/utils/images"
import { startContainer } from "../../../../integrations/tests/utils"
import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import { method } from "lodash"

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

        const response = await generateToken(oauthConfig._id)
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
            grantType,
          })

          await generateToken(oauthConfig._id)
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

          await generateToken(oauthConfig._id)
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

          await generateToken(oauthConfig._id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })
  })
})
