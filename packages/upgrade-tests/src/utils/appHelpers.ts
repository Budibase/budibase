import * as path from "path"
import * as fs from "fs"

// Store the current app context
let currentAppContext: string | null = null

export function getCurrentApp(): string | null {
  return currentAppContext
}

export function setCurrentApp(appName: string | null) {
  currentAppContext = appName
}

/**
 * Helper to run tests for a specific app
 * @param appName - The name of the app (matches the .tar.gz filename without extension)
 * @param fn - The test function to run
 */
export function forApp(appName: string, fn: () => void) {
  const currentApp = process.env.TEST_APP

  // If TEST_APP is set and doesn't match this app, skip
  if (currentApp && currentApp !== appName) {
    describe.skip(`App: ${appName}`, fn)
  } else {
    describe(`App: ${appName}`, () => {
      beforeAll(() => {
        setCurrentApp(appName)
      })

      afterAll(() => {
        setCurrentApp(null)
      })

      fn()
    })
  }
}

/**
 * Helper to run tests for multiple apps
 * @param appNames - Array of app names
 * @param fn - The test function to run for each app
 */
export function forApps(appNames: string[], fn: (appName: string) => void) {
  appNames.forEach(appName => {
    forApp(appName, () => fn(appName))
  })
}

/**
 * Get the path to an app export file
 * @param appName - The app name (without .tar.gz extension)
 * @returns The full path to the app export file
 */
export function getAppPath(appName: string): string {
  // When running from dist, we need to go up to the package root
  const packageRoot = path.join(__dirname, "../../..")
  const fixturesDir = path.join(packageRoot, "src/fixtures")
  return path.join(fixturesDir, `${appName}.tar.gz`)
}

/**
 * Check if an app export exists
 * @param appName - The app name (without .tar.gz extension)
 * @returns True if the app export file exists
 */
export function appExists(appName: string): boolean {
  return fs.existsSync(getAppPath(appName))
}

/**
 * Get all available app names from the fixtures directory
 * @returns Array of app names (without .tar.gz extension)
 */
export function getAvailableApps(): string[] {
  // When running from dist, we need to go up to the package root
  const packageRoot = path.join(__dirname, "../../..")
  const fixturesDir = path.join(packageRoot, "src/fixtures")
  
  if (!fs.existsSync(fixturesDir)) {
    return []
  }

  return fs.readdirSync(fixturesDir)
    .filter(file => file.endsWith(".tar.gz"))
    .map(file => file.replace(/\.tar\.gz$/, ""))
}

/**
 * Skip a test if the current app doesn't match
 * @param appName - The app name to check against
 * @returns A test wrapper function
 */
export function onlyForApp(appName: string) {
  return (name: string, fn: jest.ProvidesCallback) => {
    const currentApp = process.env.TEST_APP || getCurrentApp()
    
    if (currentApp && currentApp !== appName) {
      it.skip(name, fn)
    } else {
      it(name, fn)
    }
  }
}

/**
 * Skip a test if the current app matches
 * @param appName - The app name to check against
 * @returns A test wrapper function
 */
export function skipForApp(appName: string) {
  return (name: string, fn: jest.ProvidesCallback) => {
    const currentApp = process.env.TEST_APP || getCurrentApp()
    
    if (currentApp && currentApp === appName) {
      it.skip(name, fn)
    } else {
      it(name, fn)
    }
  }
}