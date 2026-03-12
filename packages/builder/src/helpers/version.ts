const parseVersion = (version?: string) => {
  if (!version) {
    return null
  }

  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) {
    return null
  }

  return match.slice(1).map(part => Number(part))
}

export const isVersionAtLeast = (
  version: string | undefined,
  minimum: string
) => {
  const current = parseVersion(version)
  const min = parseVersion(minimum)

  if (!current || !min) {
    return false
  }

  for (let index = 0; index < min.length; index++) {
    if (current[index] > min[index]) {
      return true
    }
    if (current[index] < min[index]) {
      return false
    }
  }

  return true
}
