export function preUpgrade(fn: () => void) {
  if (process.env.TEST_PHASE === "pre-upgrade") {
    describe("Pre-upgrade", fn)
  } else {
    describe.skip("Pre-upgrade", fn)
  }
}

export function postUpgrade(fn: () => void) {
  if (process.env.TEST_PHASE === "post-upgrade") {
    describe("Post-upgrade", fn)
  } else {
    describe.skip("Post-upgrade", fn)
  }
}

export function isPreUpgradePhase(): boolean {
  return process.env.TEST_PHASE === "pre-upgrade"
}

export function isPostUpgradePhase(): boolean {
  return process.env.TEST_PHASE === "post-upgrade"
}

export function getOldVersion(): string {
  const version = process.env.FROM_VERSION
  if (!version) {
    throw new Error("FROM_VERSION environment variable not set")
  }
  return version
}

export function getCurrentVersion(): string {
  const version = process.env.TO_VERSION || "current"
  return version
}
