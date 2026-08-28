import {
  DEFAULT_PASSWORD_POLICY,
  validatePasswordPolicy,
} from "@budibase/shared-core"
import type { PasswordPolicy } from "@budibase/types"
import env from "../environment"

const isSafeRegex: (regex: RegExp) => boolean = require("safe-regex")

interface BuildPasswordPolicyOptions {
  minLength?: string | number
  maxLength?: string | number
  regex?: string
  regexErrorMessage?: string
}

const parseLength = ({
  name,
  value,
  defaultValue,
}: {
  name: string
  value: string | number | undefined
  defaultValue: number
}) => {
  if (value === undefined || value === "") {
    return defaultValue
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`)
  }
  return parsed
}

export const buildPasswordPolicy = ({
  minLength,
  maxLength,
  regex,
  regexErrorMessage,
}: BuildPasswordPolicyOptions): PasswordPolicy => {
  const parsedMinLength = parseLength({
    name: "PASSWORD_MIN_LENGTH",
    value: minLength,
    defaultValue: DEFAULT_PASSWORD_POLICY.minLength,
  })
  const parsedMaxLength = parseLength({
    name: "PASSWORD_MAX_LENGTH",
    value: maxLength,
    defaultValue: DEFAULT_PASSWORD_POLICY.maxLength,
  })

  if (parsedMinLength > parsedMaxLength) {
    throw new Error(
      "PASSWORD_MIN_LENGTH must not be greater than PASSWORD_MAX_LENGTH."
    )
  }

  if (!!regex !== !!regexErrorMessage) {
    throw new Error(
      "PASSWORD_REGEX and PASSWORD_REGEX_ERROR_MESSAGE must be configured together."
    )
  }

  if (regex) {
    let compiledRegex: RegExp
    try {
      compiledRegex = new RegExp(`^(?:${regex})$`)
    } catch (_error) {
      throw new Error("PASSWORD_REGEX must be a valid JavaScript expression.")
    }

    if (!isSafeRegex(compiledRegex)) {
      throw new Error("PASSWORD_REGEX must not contain unsafe expressions.")
    }
  }

  return {
    minLength: parsedMinLength,
    maxLength: parsedMaxLength,
    ...(regex ? { regex, regexErrorMessage } : {}),
  }
}

export const PASSWORD_POLICY = buildPasswordPolicy({
  minLength: env.PASSWORD_MIN_LENGTH,
  maxLength: env.PASSWORD_MAX_LENGTH,
  regex: env.PASSWORD_REGEX,
  regexErrorMessage: env.PASSWORD_REGEX_ERROR_MESSAGE,
})

export const PASSWORD_MIN_LENGTH = PASSWORD_POLICY.minLength
export const PASSWORD_MAX_LENGTH = PASSWORD_POLICY.maxLength

export const validatePassword = ({
  password,
  enforceRegex = true,
}: {
  password: string
  enforceRegex?: boolean
}) =>
  validatePasswordPolicy({ password, policy: PASSWORD_POLICY, enforceRegex })
