import env from "../environment"

export const PASSWORD_MIN_LENGTH = +(env.PASSWORD_MIN_LENGTH || 12)
export const PASSWORD_MAX_LENGTH = +(env.PASSWORD_MAX_LENGTH || 512)

export function validatePassword(
  password: string
): { valid: true } | { valid: false; error: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password invalid. Minimum ${PASSWORD_MIN_LENGTH} characters.`,
    }
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `Password invalid. Maximum ${PASSWORD_MAX_LENGTH} characters.`,
    }
  }

  return { valid: true }
}
