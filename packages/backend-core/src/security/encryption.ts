import crypto from "crypto"
import env from "../environment"

const ALGO = "aes-256-ctr"
const SEPARATOR = "-"
const ITERATIONS = 10000
const RANDOM_BYTES = 16
const STRETCH_LENGTH = 32

export enum SecretOption {
  JWT = "jwt",
  ENCRYPTION = "encryption",
}

function getSecret(secretOption: SecretOption): string {
  let secret, secretName
  switch (secretOption) {
    case SecretOption.ENCRYPTION:
      secret = env.ENCRYPTION_KEY
      secretName = "ENCRYPTION_KEY"
      break
    case SecretOption.JWT:
    default:
      secret = env.JWT_SECRET
      secretName = "JWT_SECRET"
      break
  }
  if (!secret) {
    throw new Error(`Secret "${secretName}" has not been set in environment.`)
  }
  return secret
}

function stretchString(string: string, salt: Buffer) {
  return crypto.pbkdf2Sync(string, salt, ITERATIONS, STRETCH_LENGTH, "sha512")
}

export function encrypt(
  input: string,
  secretOption: SecretOption = SecretOption.JWT
) {
  const salt = crypto.randomBytes(RANDOM_BYTES)
  const stretched = stretchString(getSecret(secretOption), salt)
  const cipher = crypto.createCipheriv(ALGO, stretched, salt)
  const base = cipher.update(input)
  const final = cipher.final()
  const encrypted = Buffer.concat([base, final]).toString("hex")
  return `${salt.toString("hex")}${SEPARATOR}${encrypted}`
}

export function decrypt(
  input: string,
  secretOption: SecretOption = SecretOption.JWT
) {
  const [salt, encrypted] = input.split(SEPARATOR)
  const saltBuffer = Buffer.from(salt, "hex")
  const stretched = stretchString(getSecret(secretOption), saltBuffer)
  const decipher = crypto.createDecipheriv(ALGO, stretched, saltBuffer)
  const base = decipher.update(Buffer.from(encrypted, "hex"))
  const final = decipher.final()
  return Buffer.concat([base, final]).toString()
}
