import { GenericContainer, Wait } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import { OIDCInnerConfig, PKCEMethod } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import fetch from "node-fetch"

const DEX_IMAGE = "dexidp/dex:v2.37.0"
const DEX_PORT = 5556

let ports: testContainerUtils.Port[]

export async function getDexContainer(): Promise<testContainerUtils.Port[]> {
  if (!ports) {
    // Create the Dex configuration that will work with any port
    const dexConfig = `
issuer: http://localhost:${DEX_PORT}

storage:
  type: memory

web:
  http: 0.0.0.0:${DEX_PORT}
  allowedOrigins: ['*']

staticClients:
  - id: test-app
    secret: test-secret
    name: 'Test Application'
    redirectURIs:
      - 'http://localhost:4001/api/global/auth/oidc/callback'

enablePasswordDB: true

staticPasswords:
  - email: test@budibase.com
    hash: "$2y$12$6q53Pz1Xey3TZUhupeK1vO2zUk8uQsFnM1nJtrrwAHPIvMNnfwOB6" # "password"
    username: testuser
    userID: "1111"
`

    ports = await testContainerUtils.startContainer(
      new GenericContainer(DEX_IMAGE)
        .withExposedPorts(DEX_PORT)
        .withCommand(["dex", "serve", "/etc/dex/cfg/config.yaml"])
        .withCopyContentToContainer([
          {
            content: dexConfig,
            target: "/etc/dex/cfg/config.yaml",
          },
        ])
        .withWaitStrategy(
          Wait.forLogMessage(
            "listening (http) on 0.0.0.0:5556"
          ).withStartupTimeout(60000)
        )
    )
  }

  return ports
}

export interface OIDCTestConfig {
  noPkce: OIDCInnerConfig
  withPkce: OIDCInnerConfig
}

export function getOIDCConfigs(port: number): OIDCTestConfig {
  const configUrl = `http://localhost:${port}/.well-known/openid-configuration`
  const noPkceConfig: OIDCInnerConfig = {
    configUrl,
    clientID: "budibase-no-pkce",
    clientSecret: "test-secret-no-pkce",
    logo: "",
    name: "Test OIDC (No PKCE)",
    uuid: generator.guid(),
    activated: true,
    scopes: ["openid", "profile", "email"],
  }

  const withPkceConfig: OIDCInnerConfig = {
    configUrl,
    clientID: "budibase-pkce",
    clientSecret: "test-secret-pkce",
    logo: "",
    name: "Test OIDC (PKCE)",
    uuid: generator.guid(),
    activated: true,
    scopes: ["openid", "profile", "email"],
    pkce: PKCEMethod.S256,
  }

  return {
    noPkce: noPkceConfig,
    withPkce: withPkceConfig,
  }
}

export async function waitForDex(): Promise<number> {
  const containerPorts = await getDexContainer()
  const dexPort = containerPorts.find(x => x.container === DEX_PORT)?.host
  if (!dexPort) {
    throw new Error("Dex port not found")
  }
  const wellKnownUrl = `http://localhost:${dexPort}/.well-known/openid-configuration`
  const response = await fetch(wellKnownUrl)

  if (!response.ok) {
    throw new Error("Unable to fetch well known openid-configuration")
  }
  return dexPort
}
