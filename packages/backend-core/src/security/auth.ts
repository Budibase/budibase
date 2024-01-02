const MIN_LENGTH = 8
const MAX_LENGTH = 100

export function validatePassword(
  password: string
): { valid: true } | { valid: false; error: string } {
  if (!password || password.length < MIN_LENGTH) {
    return {
      valid: false,
      error: "Password invalid. Minimum eight characters.",
    }
  }

  if (password.length > MAX_LENGTH) {
    return {
      valid: false,
      error: "Password invalid. Maximum hundred characters.",
    }
  }

  return { valid: true }
}
