const MIN_LENGTH = 8

export function validatePassword(
  password: string
): { valid: true } | { valid: false; error: string } {
  if (password?.length < MIN_LENGTH) {
    return { valid: false, error: "Password invalid. Minimum eight characters" }
  }

  return { valid: true }
}
