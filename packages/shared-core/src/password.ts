import type { PasswordPolicy } from "@budibase/types"

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 12,
  maxLength: 512,
}

export type PasswordValidationResult =
  | { valid: true }
  | { valid: false; error: string }

interface ValidatePasswordOptions {
  password: string | undefined
  policy: PasswordPolicy
  enforceRegex?: boolean
}

export const validatePasswordPolicy = ({
  password,
  policy,
  enforceRegex = true,
}: ValidatePasswordOptions): PasswordValidationResult => {
  if (!password || password.length < policy.minLength) {
    return {
      valid: false,
      error: `Password invalid. Minimum ${policy.minLength} characters.`,
    }
  }

  if (password.length > policy.maxLength) {
    return {
      valid: false,
      error: `Password invalid. Maximum ${policy.maxLength} characters.`,
    }
  }

  if (
    enforceRegex &&
    policy.regex &&
    !new RegExp(`^(?:${policy.regex})$`).test(password)
  ) {
    return {
      valid: false,
      error: policy.regexErrorMessage!,
    }
  }

  return { valid: true }
}
