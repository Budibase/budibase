import { GenericContainer, Wait } from "testcontainers"
import { testContainerUtils } from "@budibase/backend-core/tests"
import { OIDCInnerConfig, PKCEMethod } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import fetch from "node-fetch"
import * as crypto from "crypto"

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
  - id: budibase-no-pkce
    secret: test-secret-no-pkce
    name: 'Budibase Test (No PKCE)'
    redirectURIs:
      - 'http://localhost:4001/api/global/auth/oidc/callback'
  - id: budibase-pkce
    secret: test-secret-pkce
    name: 'Budibase Test (PKCE)'
    redirectURIs:
      - 'http://localhost:4001/api/global/auth/oidc/callback'

enablePasswordDB: true

staticPasswords:
  - email: test@budibase.com
    hash: "$2y$12$6q53Pz1Xey3TZUhupeK1vO2zUk8uQsFnM1nJtrrwAHPIvMNnfwOB6" # "password"
    username: testuser
    userID: "1111"
`

    const container = new GenericContainer(DEX_IMAGE)
      // need to lock the port, its important for dex to present its port
      .withExposedPorts({ container: 5556, host: 5556 })
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
    ports = await testContainerUtils.startContainer(container)
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

// PKCE Helper Functions
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url")
}

export function generateCodeChallenge(
  verifier: string,
  method: PKCEMethod
): string {
  if (method === PKCEMethod.PLAIN) {
    return verifier
  } else if (method === PKCEMethod.S256) {
    return crypto.createHash("sha256").update(verifier).digest("base64url")
  }
  throw new Error(`Unsupported PKCE method: ${method}`)
}

// OIDC Authentication Helper Functions
export interface AuthorizationUrlParams {
  authorizationUrl: string
  clientId: string
  redirectUri: string
  state: string
  nonce: string
  scopes?: string[]
  pkce?: {
    codeChallenge: string
    codeChallengeMethod: PKCEMethod
  }
}

export function buildAuthorizationUrl(params: AuthorizationUrlParams): string {
  const url = new URL(params.authorizationUrl)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("client_id", params.clientId)
  url.searchParams.set("redirect_uri", params.redirectUri)
  url.searchParams.set("state", params.state)
  url.searchParams.set("nonce", params.nonce)
  url.searchParams.set(
    "scope",
    (params.scopes || ["openid", "profile", "email"]).join(" ")
  )

  if (params.pkce) {
    url.searchParams.set("code_challenge", params.pkce.codeChallenge)
    url.searchParams.set(
      "code_challenge_method",
      params.pkce.codeChallengeMethod
    )
  }

  return url.toString()
}

export async function exchangeCodeForTokens(
  tokenUrl: string,
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<any> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  })

  if (codeVerifier) {
    body.set("code_verifier", codeVerifier)
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
  }

  return response.json()
}
