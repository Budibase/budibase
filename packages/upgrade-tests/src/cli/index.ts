import { Command } from "commander"
import { bold, gray, green, red } from "chalk"
import * as fs from "fs"
import * as path from "path"
import {
  generateDockerConfig,
  stopContainer,
  removeContainer,
  removeVolume,
  createVolume,
  runContainer,
  getContainerPort,
  waitForHealthy,
  buildCurrentVersion,
} from "./docker"
import { importApp } from "./appImport"
import { runTests } from "./testRunner"

const program = new Command()

// Helper to get project root
function getProjectRoot(): string {
  // When running from dist/src/cli, we need to go up 5 levels to reach project root
  // dist/src/cli -> dist/src -> dist -> upgrade-tests -> packages -> project root
  return path.join(__dirname, "../../../../..")
}

// Clean up function
async function cleanup(
  config: ReturnType<typeof generateDockerConfig>,
  showDetails = true
) {
  if (showDetails) {
    console.log(bold("\n🧹 Cleaning up..."))
    await stopContainer(config.containerName)
    await removeContainer(config.containerName)
    await removeVolume(config.volumeName)
  } else {
    // Silent cleanup
    await stopContainer(config.containerName, true)
    await removeContainer(config.containerName, true)
    await removeVolume(config.volumeName, true)
  }
}

// Clean up context files
function cleanupContextFiles(silent = false) {
  // Clean old global context file
  const globalContext = path.join(__dirname, "../..", ".upgrade-context.json")
  if (fs.existsSync(globalContext)) {
    fs.unlinkSync(globalContext)
  }

  // Clean per-test context files
  const contextFiles = fs
    .readdirSync("/tmp")
    .filter(
      file => file.startsWith("upgrade-context-") && file.endsWith(".json")
    )

  for (const file of contextFiles) {
    try {
      fs.unlinkSync(path.join("/tmp", file))
    } catch (error) {
      // Ignore errors
    }
  }

  if (!silent && contextFiles.length > 0) {
    console.log(gray(`Cleaned up ${contextFiles.length} context files`))
  }
}

program
  .name("budibase-upgrade-test")
  .description("Test Budibase upgrades with ease")
  .version("1.0.0")

// Full upgrade test command
program
  .command("full")
  .description("Run full upgrade test from specified version to current")
  .requiredOption("--from <version>", "The Budibase version to upgrade from")
  .option("--to <version>", "The version to upgrade to", "current")
  .option("--app <path|name>", "Path to app export or fixture name to import")
  .option("--test-app <name>", "Test only a specific app")
  .option("--no-cleanup", "Don't clean up containers after test")
  .option(
    "--no-build",
    "Skip building current version (assumes image already exists)"
  )
  .option("--verbose", "Show detailed output")
  .action(async options => {
    const config = generateDockerConfig()
    console.log(bold("\n🚀 Starting Full Upgrade Test"))
    console.log(gray(`Upgrading from ${options.from} to ${options.to}`))
    console.log(gray(`Container: ${config.containerName}`))
    
    // Set up signal handlers for cleanup
    let cleanupInProgress = false
    const handleSignal = async (signal: string) => {
      if (cleanupInProgress) return
      cleanupInProgress = true
      
      console.log(red(`\n\n❌ Received ${signal}, cleaning up...`))
      if (options.cleanup !== false) {
        try {
          await cleanup(config)
        } catch (error) {
          console.error(red("❌ Cleanup failed:"), error)
        }
      }
      process.exit(1)
    }
    
    process.on("SIGINT", () => handleSignal("SIGINT"))
    process.on("SIGTERM", () => handleSignal("SIGTERM"))

    try {
      // Clean up any existing containers silently
      await cleanup(config, false)
      cleanupContextFiles(true)

      // Create volume
      await createVolume(config.volumeName)

      // Start old version
      console.log(bold(`\n📦 Starting Budibase ${options.from}`))
      await runContainer({
        containerName: config.containerName,
        volumeName: config.volumeName,
        image: `budibase/budibase:${options.from}`,
        env: {
          INTERNAL_API_KEY: config.internalApiKey,
          MULTI_TENANCY: "0",
          SELF_HOSTED: "1",
          REDIS_PASSWORD: "budibase",
          BB_ADMIN_USER_EMAIL: config.adminEmail,
          BB_ADMIN_USER_PASSWORD: config.adminPassword,
        },
      })

      const port = await getContainerPort(config.containerName)
      const budibaseUrl = `http://localhost:${port}`

      await waitForHealthy(config.containerName)

      // Wait for admin user
      console.log(gray("Waiting for admin user to be created..."))
      await new Promise(resolve => setTimeout(resolve, 10000))

      // Set environment for BudibaseClient
      process.env.BUDIBASE_URL = budibaseUrl
      process.env.INTERNAL_API_KEY = config.internalApiKey
      process.env.BB_ADMIN_USER_EMAIL = config.adminEmail
      process.env.BB_ADMIN_USER_PASSWORD = config.adminPassword
      process.env.BUDIBASE_CONTAINER_NAME = config.containerName

      // Import app
      const appToImport = options.app || "car-rental"
      console.log(bold(`\n📱 Importing app: ${appToImport}`))
      const { appId } = await importApp(appToImport, options.verbose)

      // Run pre-upgrade tests
      console.log(bold("\n🧪 Pre-Upgrade Tests"))
      const preSuccess = await runTests({
        phase: "pre-upgrade",
        verbose: options.verbose,
        testAppId: appId,
        testApp: options.testApp,
        budibaseUrl,
        internalApiKey: config.internalApiKey,
        adminEmail: config.adminEmail,
        adminPassword: config.adminPassword,
        containerName: config.containerName,
        oldVersion: options.from,
        currentVersion: options.to,
      })

      if (!preSuccess) {
        throw new Error("Pre-upgrade tests failed")
      }

      // Stop old version
      console.log(bold("\n🔄 Upgrading Budibase..."))
      await stopContainer(config.containerName)
      await removeContainer(config.containerName)

      // Start new version
      console.log(bold(`\n📦 Starting Budibase ${options.to}`))

      let image = `budibase/budibase:${options.to}`
      if (options.to === "current") {
        if (!options.build) {
          console.log(
            gray("Skipping build, using existing budibase:current image")
          )
        } else {
          await buildCurrentVersion(getProjectRoot())
        }
        image = "budibase:current"
      }

      await runContainer({
        containerName: config.containerName,
        volumeName: config.volumeName,
        image,
        env: {
          INTERNAL_API_KEY: config.internalApiKey,
          MULTI_TENANCY: "0",
          SELF_HOSTED: "1",
          REDIS_PASSWORD: "budibase",
          BB_ADMIN_USER_EMAIL: config.adminEmail,
          BB_ADMIN_USER_PASSWORD: config.adminPassword,
        },
      })

      const newPort = await getContainerPort(config.containerName)
      const newBudibaseUrl = `http://localhost:${newPort}`

      await waitForHealthy(config.containerName)

      // Update environment for new URL
      process.env.BUDIBASE_URL = newBudibaseUrl

      // Run post-upgrade tests
      console.log(bold("\n🧪 Post-Upgrade Tests"))
      const postSuccess = await runTests({
        phase: "post-upgrade",
        verbose: options.verbose,
        testAppId: appId,
        testApp: options.testApp,
        budibaseUrl: newBudibaseUrl,
        internalApiKey: config.internalApiKey,
        adminEmail: config.adminEmail,
        adminPassword: config.adminPassword,
        containerName: config.containerName,
        oldVersion: options.from,
        currentVersion: options.to,
      })

      if (!postSuccess) {
        throw new Error("Post-upgrade tests failed")
      }

      // Success!
      console.log(bold(green("\n✨ Upgrade Test Completed Successfully!")))
      
      // Clean up on success
      if (options.cleanup !== false) {
        await cleanup(config)
      }
    } catch (error) {
      console.error(red("\n❌ Upgrade test failed:"), error)
      
      // Clean up on error before exiting
      if (options.cleanup !== false) {
        try {
          await cleanup(config)
        } catch (cleanupError) {
          console.error(red("❌ Cleanup failed:"), cleanupError)
        }
      }
      
      process.exit(1)
    }
  })

// Pre-upgrade test command
program
  .command("pre")
  .description("Run only pre-upgrade tests")
  .option("--from <version>", "The Budibase version")
  .option("--app <path|name>", "Path to app export or fixture name to import")
  .option("--verbose", "Show detailed output")
  .action(async options => {
    console.log(bold("\n🧪 Running Pre-Upgrade Tests Only"))

    try {
      // Set default URL if not already set
      if (!process.env.BUDIBASE_URL) {
        process.env.BUDIBASE_URL = "http://localhost:10000"
      }

      // Import app if specified
      if (options.app) {
        console.log(bold(`\n📱 Importing app: ${options.app}`))
        const { appId } = await importApp(options.app, options.verbose)
        process.env.TEST_APP_ID = appId
      } else {
        console.log(bold(`\n📱 Importing default app: car-rental`))
        const { appId } = await importApp("car-rental", options.verbose)
        process.env.TEST_APP_ID = appId
      }

      // Run tests
      const success = await runTests({
        phase: "pre-upgrade",
        verbose: options.verbose,
        budibaseUrl: process.env.BUDIBASE_URL!,
        internalApiKey: process.env.INTERNAL_API_KEY || "budibase",
        adminEmail: process.env.BB_ADMIN_USER_EMAIL || "admin@example.com",
        adminPassword: process.env.BB_ADMIN_USER_PASSWORD || "admin123!",
        containerName: process.env.BUDIBASE_CONTAINER_NAME || "local",
        oldVersion: options.from,
      })

      if (!success) {
        process.exit(1)
      }
    } catch (error) {
      console.error(red("\n❌ Pre-upgrade tests failed:"), error)
      process.exit(1)
    }
  })

// Post-upgrade test command
program
  .command("post")
  .description("Run only post-upgrade tests")
  .option("--verbose", "Show detailed output")
  .action(async options => {
    console.log(bold("\n🧪 Running Post-Upgrade Tests Only"))

    if (!process.env.TEST_APP_ID) {
      console.error(red("❌ TEST_APP_ID environment variable is required"))
      console.log(gray("\nEither:"))
      console.log(gray("  1. Run the full upgrade test"))
      console.log(gray("  2. Set TEST_APP_ID manually"))
      process.exit(1)
    }

    try {
      const success = await runTests({
        phase: "post-upgrade",
        verbose: options.verbose,
        testAppId: process.env.TEST_APP_ID,
        budibaseUrl: process.env.BUDIBASE_URL || "http://localhost:10000",
        internalApiKey: process.env.INTERNAL_API_KEY || "budibase",
        adminEmail: process.env.BB_ADMIN_USER_EMAIL || "admin@example.com",
        adminPassword: process.env.BB_ADMIN_USER_PASSWORD || "admin123!",
        containerName: process.env.BUDIBASE_CONTAINER_NAME || "local",
      })

      if (!success) {
        process.exit(1)
      }
    } catch (error) {
      console.error(red("\n❌ Post-upgrade tests failed:"), error)
      process.exit(1)
    }
  })

// Parse arguments
program.parse(process.argv)

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
