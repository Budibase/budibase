import { spawn } from "child_process"
import chalk from "chalk"
import * as path from "path"

export type TestPhase = "pre-upgrade" | "post-upgrade"

export interface TestRunnerOptions {
  phase: TestPhase
  verbose?: boolean
  testAppId?: string
  testApp?: string
  budibaseUrl: string
  internalApiKey: string
  adminEmail: string
  adminPassword: string
  containerName: string
  oldVersion?: string
  currentVersion?: string
}

export async function runTests(options: TestRunnerOptions): Promise<boolean> {
  // Set up environment variables
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    TEST_PHASE: options.phase,
    BUDIBASE_URL: options.budibaseUrl,
    INTERNAL_API_KEY: options.internalApiKey,
    BB_ADMIN_USER_EMAIL: options.adminEmail,
    BB_ADMIN_USER_PASSWORD: options.adminPassword,
    BUDIBASE_CONTAINER_NAME: options.containerName,
  }

  if (options.testAppId) {
    env.TEST_APP_ID = options.testAppId
  }
  
  if (options.testApp) {
    env.TEST_APP = options.testApp
  }
  
  if (options.oldVersion) {
    env.OLD_VERSION = options.oldVersion
  }
  
  if (options.currentVersion) {
    env.CURRENT_VERSION = options.currentVersion
  }

  console.log(chalk.bold(`\n${chalk.blue("►")} Running ${options.phase} tests...\n`))

  return new Promise((resolve) => {
    const testProcess = spawn("yarn", ["test"], {
      cwd: path.join(__dirname, "../.."),
      env,
      stdio: "inherit",
      shell: true,
    })

    testProcess.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green(`\n✓ ${options.phase} tests completed successfully!`))
        resolve(true)
      } else {
        console.error(chalk.red(`\n✗ ${options.phase} tests failed`))
        resolve(false)
      }
    })

    testProcess.on("error", (error) => {
      console.error(chalk.red(`\n✗ Error running tests: ${error.message}`))
      resolve(false)
    })
  })
}

