import { program } from "@commander-js/extra-typings"
import { bold, gray, green, red, blue } from "chalk"
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
import { importApp, getAvailableApps } from "./appImport"
import { runTests } from "./testRunner"

function getProjectRoot(): string {
  // When running from dist/src/cli, we need to go up 5 levels to reach project
  // root dist/src/cli -> dist/src -> dist -> upgrade-tests -> packages ->
  // project root
  return path.join(__dirname, "../../../../..")
}

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

function cleanupContextFiles(silent = false) {
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
  .allowExcessArguments()
  .allowUnknownOption()
  .action(async (options, { args }) => {
    const config = generateDockerConfig()
    console.log(bold("\n🚀 Starting Full Upgrade Test"))
    console.log(gray(`Upgrading from ${options.from} to ${options.to}`))
    console.log(gray(`Container: ${config.containerName}`))

    if (args.length > 0) {
      console.log(gray(`Extra Jest args: ${args.join(" ")}`))
    }

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

      // Import app(s)
      const appMappings: Array<{ name: string; id: string }> = []

      if (options.app) {
        // Single app mode
        console.log(bold(`\n📱 Importing app: ${options.app}`))
        const { appId, name } = await importApp(options.app, options.verbose)
        appMappings.push({ name, id: appId })
      } else {
        // Multiple app mode - import all available apps
        const availableApps = await getAvailableApps()
        console.log(
          bold(`\n📱 Importing ${availableApps.length} apps from fixtures`)
        )

        for (const appName of availableApps) {
          console.log(gray(`  • Importing ${appName}...`))
          const { appId, name } = await importApp(appName, options.verbose)
          appMappings.push({ name, id: appId })
        }
      }

      // Run pre-upgrade tests for each app
      console.log(bold("\n🧪 Pre-Upgrade Tests"))
      let allPreTestsPassed = true

      for (const app of appMappings) {
        console.log(bold(blue(`\n  Testing app: ${app.name}`)))
        const preSuccess = await runTests({
          phase: "pre-upgrade",
          verbose: options.verbose,
          testAppId: app.id,
          testAppName: app.name,
          testApp: options.testApp,
          extraArgs: args,
          budibaseUrl,
          internalApiKey: config.internalApiKey,
          adminEmail: config.adminEmail,
          adminPassword: config.adminPassword,
          containerName: config.containerName,
          fromVersion: options.from,
          toVersion: options.to,
        })

        if (!preSuccess) {
          console.error(red(`  ✗ Pre-upgrade tests failed for ${app.name}`))
          allPreTestsPassed = false
        }
      }

      if (!allPreTestsPassed) {
        throw new Error("Pre-upgrade tests failed for one or more apps")
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

      // Run post-upgrade tests for each app
      console.log(bold("\n🧪 Post-Upgrade Tests"))
      let allPostTestsPassed = true

      for (const app of appMappings) {
        console.log(bold(blue(`\n  Testing app: ${app.name}`)))
        const postSuccess = await runTests({
          phase: "post-upgrade",
          verbose: options.verbose,
          testAppId: app.id,
          testAppName: app.name,
          testApp: options.testApp,
          extraArgs: args,
          budibaseUrl: newBudibaseUrl,
          internalApiKey: config.internalApiKey,
          adminEmail: config.adminEmail,
          adminPassword: config.adminPassword,
          containerName: config.containerName,
          fromVersion: options.from,
          toVersion: options.to,
        })

        if (!postSuccess) {
          console.error(red(`  ✗ Post-upgrade tests failed for ${app.name}`))
          allPostTestsPassed = false
        }
      }

      if (!allPostTestsPassed) {
        throw new Error("Post-upgrade tests failed for one or more apps")
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
  .allowExcessArguments()
  .allowUnknownOption()
  .action(async (options, { args }) => {
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
        extraArgs: args,
        budibaseUrl: process.env.BUDIBASE_URL!,
        internalApiKey: process.env.INTERNAL_API_KEY || "budibase",
        adminEmail: process.env.BB_ADMIN_USER_EMAIL || "admin@example.com",
        adminPassword: process.env.BB_ADMIN_USER_PASSWORD || "admin123!",
        containerName: process.env.BUDIBASE_CONTAINER_NAME || "local",
        fromVersion: options.from,
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
  .allowExcessArguments()
  .allowUnknownOption()
  .action(async (options, { args }) => {
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
        extraArgs: args,
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
