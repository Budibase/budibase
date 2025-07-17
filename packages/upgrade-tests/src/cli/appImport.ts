import * as fs from "fs"
import * as path from "path"
import { yellow, blue, green } from "chalk"
import ora from "ora"
import { BudibaseClient } from "../api/BudibaseClient"

function getFixturesDir(): string {
  // When running from dist, we need to go back to the package root
  // __dirname will be dist/src/cli, so we go up 3 levels
  const packageRoot = path.join(__dirname, "../../..")
  return path.join(packageRoot, "src/fixtures")
}

export async function getAvailableApps(): Promise<string[]> {
  const fixturesDir = getFixturesDir()

  if (!fs.existsSync(fixturesDir)) {
    console.error(yellow(`Fixtures directory not found: ${fixturesDir}`))
    return []
  }

  return fs
    .readdirSync(fixturesDir)
    .filter(file => file.endsWith(".tar.gz"))
    .map(file => file.replace(/\.tar\.gz$/, ""))
    .sort()
}

export function getAppPath(appName: string): string | null {
  const fixturesDir = getFixturesDir()

  // Check if it's a direct file path
  if (fs.existsSync(appName)) {
    return appName
  }

  // Try to find in fixtures
  const appPath = path.join(fixturesDir, `${appName}.tar.gz`)
  if (fs.existsSync(appPath)) {
    return appPath
  }

  // Try without .tar.gz extension
  const directPath = path.join(fixturesDir, appName)
  if (fs.existsSync(directPath)) {
    return directPath
  }

  return null
}

export interface ImportAppResult {
  appId: string
  name: string
}

export async function importApp(
  appNameOrPath: string,
  verbose = false
): Promise<ImportAppResult> {
  const appPath = getAppPath(appNameOrPath)

  if (!appPath) {
    const available = await getAvailableApps()
    throw new Error(
      `App not found: ${appNameOrPath}\n` +
        `Available apps:\n${available.map(app => `  - ${app}`).join("\n")}`
    )
  }

  const appName = path.basename(appPath, ".tar.gz").replace(/-/g, " ")
  const spinner = ora(`Importing app: ${blue(appName)}`).start()

  try {
    // Use the withInternalAPIKey BudibaseClient that doesn't require user auth
    const client = await BudibaseClient.withInternalAPIKey()

    if (verbose) {
      spinner.text = `Uploading ${blue(appName)} (${getFileSize(appPath)})`
    }

    // Import the app using the client
    const appId = await client.application.import(appPath, appName)

    spinner.succeed(`App imported successfully: ${green(appId)}`)

    return { appId, name: appName }
  } catch (error) {
    spinner.fail(`Failed to import app: ${appName}`)
    throw error
  }
}

function getFileSize(filePath: string): string {
  const stats = fs.statSync(filePath)
  const bytes = stats.size
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
