import semver from "semver"

export const isVersionAtLeast = (
  version: string | undefined,
  minimum: string
) => {
  const current = semver.coerce(version)
  const min = semver.coerce(minimum)

  if (!current || !min) {
    return false
  }

  return semver.gte(current, min)
}
