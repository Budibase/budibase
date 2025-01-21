import environment, { SECRETS } from "../environment"

export function stringContainsSecret(str: string) {
  if (str.includes("-----BEGIN PRIVATE KEY-----")) {
    return true
  }

  for (const key of SECRETS) {
    const value = environment[key]
    if (typeof value !== "string" || value === "") {
      continue
    }

    if (str.includes(value)) {
      return true
    }
  }

  return false
}
