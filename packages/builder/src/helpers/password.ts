import type { PasswordPolicy } from "@budibase/types"

const DEFAULT_TEMPORARY_PASSWORD_LENGTH = 12
const PASSWORD_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

export const generateTemporaryPassword = ({
  policy,
}: {
  policy: PasswordPolicy
}) => {
  const length = Math.min(
    policy.maxLength,
    Math.max(policy.minLength, DEFAULT_TEMPORARY_PASSWORD_LENGTH)
  )
  const bytes = new Uint8Array(length)
  window.crypto.getRandomValues(bytes)
  return Array.from(
    bytes,
    byte => PASSWORD_CHARACTERS[byte % PASSWORD_CHARACTERS.length]
  ).join("")
}
