import {
  constants,
  encryption,
  env as coreEnv,
  sessions,
  tenancy,
  users,
  utils as coreUtils,
} from "@budibase/backend-core"
import { Ctx, EmbedSSOConfig, PASSWORD_REPLACEMENT } from "@budibase/types"
import jwt from "jsonwebtoken"

const SECRET_ENCODING_PREFIX = "bbembed_enc::"

const encodeSecret = (value: string): string => {
  if (!value || value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return `${SECRET_ENCODING_PREFIX}${encryption.encrypt(value)}`
}

const decodeSecret = (value: string): string => {
  if (!value || !value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return encryption.decrypt(value.slice(SECRET_ENCODING_PREFIX.length))
}

/**
 * Encrypt the secret before storage. When the incoming key is the password
 * replacement sentinel, the existing (already encrypted) key is preserved so
 * the masked value sent to the builder round-trips without overwriting it.
 */
export function encodeConfigForStorage(
  incoming: EmbedSSOConfig,
  existing?: EmbedSSOConfig
): EmbedSSOConfig {
  let key = incoming.key
  if (key === PASSWORD_REPLACEMENT) {
    key = existing?.key || ""
  } else {
    key = encodeSecret(key)
  }
  return { ...incoming, key }
}

/**
 * Mask the secret so the builder can display and edit the config without ever
 * receiving the real key.
 */
export function maskConfigForBuilder(config: EmbedSSOConfig): EmbedSSOConfig {
  return { ...config, key: config.key ? PASSWORD_REPLACEMENT : "" }
}

const getEmailFromPayload = (
  payload: Record<string, any>,
  emailClaim = "email"
): string | undefined => {
  const value = emailClaim
    .split(".")
    .reduce<any>((acc, part) => (acc == null ? acc : acc[part]), payload)
  return typeof value === "string" ? value : undefined
}

const verifyToken = (
  token: string,
  config: EmbedSSOConfig
): Record<string, any> => {
  const key = decodeSecret(config.key)
  const options: jwt.VerifyOptions = { algorithms: [config.algorithm] }
  if (config.issuer) {
    options.issuer = config.issuer
  }
  const decoded = jwt.verify(token, key, options)
  if (typeof decoded === "string") {
    throw new Error("Unexpected token payload")
  }
  return decoded
}

/**
 * Verify a signed token from the embedding host, map its identity to an
 * existing Budibase user and, if found, establish a Budibase session by setting
 * the auth cookie. Returns true if the user was authenticated.
 */
export async function authenticateEmbedUser(
  ctx: Ctx,
  config: EmbedSSOConfig,
  token: string
): Promise<boolean> {
  let payload: Record<string, any>
  try {
    payload = verifyToken(token, config)
  } catch (err) {
    console.warn(`Embed SSO token verification failed: ${err}`)
    return false
  }

  const email = getEmailFromPayload(payload, config.emailClaim)?.toLowerCase()
  if (!email) {
    console.warn("Embed SSO token did not contain a valid email claim")
    return false
  }

  const user = await users.getGlobalUserByEmail(email)
  if (!user || !user._id) {
    console.warn("Embed SSO: no existing Budibase user for the provided email")
    return false
  }

  const sessionId = coreUtils.newid()
  const tenantId = tenancy.getTenantId()
  await sessions.createASession(user._id, {
    sessionId,
    tenantId,
    email: user.email,
  })
  const authToken = jwt.sign(
    { userId: user._id, sessionId, tenantId, email: user.email },
    coreEnv.JWT_SECRET!
  )
  coreUtils.setCookie(ctx, authToken, constants.Cookie.Auth, {
    sign: false,
    httpOnly: true,
    sameSite: "none",
  })
  return true
}
