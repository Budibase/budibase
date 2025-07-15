import * as semver from "semver"

export function isOlderThan(currentVersion: string, targetVersion: string): boolean {
  // Handle special cases
  if (currentVersion === "latest" || currentVersion === "current" || !currentVersion) {
    return false
  }
  
  // Clean version strings (remove 'v' prefix if present)
  const cleanCurrent = currentVersion.replace(/^v/, "")
  const cleanTarget = targetVersion.replace(/^v/, "")
  
  // Check if versions are valid semver
  if (!semver.valid(cleanCurrent) || !semver.valid(cleanTarget)) {
    // If current version is not valid semver (like "0.0.0+local"), assume it's newer
    if (!semver.valid(cleanCurrent)) {
      return false
    }
    // If target is not valid, we can't compare
    return false
  }
  
  return semver.lt(cleanCurrent, cleanTarget)
}

export function isNewerThan(currentVersion: string, targetVersion: string): boolean {
  // Handle special cases
  if (currentVersion === "latest" || currentVersion === "current" || !currentVersion) {
    return true
  }
  
  const cleanCurrent = currentVersion.replace(/^v/, "")
  const cleanTarget = targetVersion.replace(/^v/, "")
  
  // Check if versions are valid semver
  if (!semver.valid(cleanCurrent) || !semver.valid(cleanTarget)) {
    // If current version is not valid semver (like "0.0.0+local"), assume it's newer
    if (!semver.valid(cleanCurrent)) {
      return true
    }
    // If target is not valid, we can't compare
    return false
  }
  
  return semver.gt(cleanCurrent, cleanTarget)
}

export function skipIfOlderThan(version: string) {
  return (name: string, fn: jest.ProvidesCallback) => {
    const oldVersion = process.env.OLD_VERSION || ""
    if (isOlderThan(oldVersion, version)) {
      it.skip(name, fn)
    } else {
      it(name, fn)
    }
  }
}

export function skipIfNewerThan(version: string) {
  return (name: string, fn: jest.ProvidesCallback) => {
    const oldVersion = process.env.OLD_VERSION || ""
    if (isNewerThan(oldVersion, version)) {
      it.skip(name, fn)
    } else {
      it(name, fn)
    }
  }
}

export function onlyForVersions(versions: string[]) {
  return (name: string, fn: jest.ProvidesCallback) => {
    const oldVersion = process.env.OLD_VERSION || ""
    const cleanOld = oldVersion.replace(/^v/, "")
    const cleanVersions = versions.map(v => v.replace(/^v/, ""))
    
    if (cleanVersions.includes(cleanOld)) {
      it(name, fn)
    } else {
      it.skip(name, fn)
    }
  }
}