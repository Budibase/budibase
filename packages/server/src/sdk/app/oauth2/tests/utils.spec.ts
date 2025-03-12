import { generator } from "@budibase/backend-core/tests"
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers"
import sdk from "../../.."
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { generateToken } from "../utils"
import path from "path"

const config = new TestConfiguration()

const keyClockImage = `quay.io/keycloak/keycloak@sha256:2ce6c7c70994c70dbbd70b372a5422c3b4eebb32583175eac03751320609e52c`

const volumePath = path.resolve(__dirname, "docker-volume")

describe("oauth2 utils", () => {
  let container: StartedTestContainer

  let keycloakUrl: string

  beforeAll(async () => {
    await config.init()

    container = await new GenericContainer(keyClockImage)
      .withName("keycloak_testcontainer")
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

  afterAll(async () => {
    await container.stop()
  })

  describe("generateToken", () => {
    it("successfully generates tokens", async () => {
      const response = await config.doInContext(config.appId, async () => {
        const oauthConfig = await sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
        })

        const response = await generateToken(oauthConfig.id)
        return response
      })

      expect(response).toBe("")
    })
  })
})
