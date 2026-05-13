import { blacklist, setEnv as setCoreEnv } from "@budibase/backend-core"
import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import path from "path"
import { GenericContainer, Wait } from "testcontainers"
import { startContainer } from "../../../../integrations/tests/utils"
import { KEYCLOAK_IMAGE } from "../../../../integrations/tests/utils/images"
import { validateConfig } from "../utils"

const volumePath = path.resolve(__dirname, "docker-volume")

jest.setTimeout(90000)

describe("oauth2 security", () => {
  let keycloakUrl: string
  let restoreEnv: (() => void) | undefined

  const getConfig = () => ({
    url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
    clientId: "my-client",
    clientSecret: "my-secret",
    method: OAuth2CredentialsMethod.BODY,
    grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
  })

  beforeAll(async () => {
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

  afterEach(async () => {
    restoreEnv?.()
    restoreEnv = undefined
    await blacklist.refreshBlacklist()
  })

  it("rejects a real Keycloak token endpoint when localhost is blacklisted", async () => {
    restoreEnv = setCoreEnv({
      BLACKLIST_IPS: undefined,
      SELF_HOSTED: false,
    })
    await blacklist.refreshBlacklist()

    const result = await validateConfig(getConfig())

    expect(result).toEqual({
      valid: false,
      message: "URL is blocked or could not be resolved safely.",
    })
  })
})
