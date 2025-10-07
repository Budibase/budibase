#!/usr/bin/env node

const { Command } = require("commander")
const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
require("dotenv").config()

const program = new Command()

// API client helper
class BudibaseClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
    this.apiKey = apiKey
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/public/v1${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "x-budibase-api-key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${text}`
      )
    }

    return response.json()
  }

  async getUsers() {
    return this.request("/users/search", {
      method: "POST",
      body: JSON.stringify({}),
    })
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`)
  }

  async createUser(user) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async updateUser(userId, user) {
    return this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  }

  async getApps() {
    return this.request("/applications/search", {
      method: "POST",
      body: JSON.stringify({}),
    })
  }
}

// Export users from source instance
async function exportUsers(options) {
  console.log("Starting user export...")

  const sourceUrl = options.source || process.env.SOURCE_URL
  const sourceApiKey = options.apiKey || process.env.SOURCE_API_KEY

  if (!sourceUrl || !sourceApiKey) {
    console.error(
      "Error: Source URL and API key are required. Provide via --source and --api-key or set SOURCE_URL and SOURCE_API_KEY environment variables."
    )
    process.exit(1)
  }

  const client = new BudibaseClient(sourceUrl, sourceApiKey)

  try {
    // Fetch users
    console.log("Fetching users...")
    const usersResponse = await client.getUsers()
    const users = usersResponse.data || []
    console.log(`Found ${users.length} users`)

    // Fetch apps for mapping
    console.log("Fetching applications...")
    const appsResponse = await client.getApps()
    const apps = appsResponse.data || []
    console.log(`Found ${apps.length} applications`)

    // Create app ID to name mapping
    const appMapping = {}

    for (const app of apps) {
      appMapping[app._id] = app.name
    }

    // Note: Role names are standardized in Budibase (BASIC, POWER, ADMIN)
    // and don't need to be fetched - they're consistent across instances

    // Transform users to include readable app names
    // Role IDs are standardized (BASIC, POWER, ADMIN, etc.) and consistent across instances
    const exportData = {
      exportDate: new Date().toISOString(),
      sourceUrl,
      users: users.map(user => ({
        email: user.email,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        builder: user.builder,
        admin: user.admin,
        roles: user.roles || {},
        rolesMapped:
          user.roles &&
          Object.entries(user.roles).reduce((acc, [appId, roleId]) => {
            const appName = appMapping[appId] || appId
            acc[appName] = roleId // roleId is already standardized (BASIC, POWER, ADMIN)
            return acc
          }, {}),
      })),
      appMapping,
    }

    // Write to file
    const outputPath = options.output || "users-export.json"
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))

    console.log(`\nExport complete!`)
    console.log(`Exported ${users.length} users to ${outputPath}`)
    console.log(`\nSummary:`)
    console.log(`- Total users: ${users.length}`)
    console.log(
      `- Workspace admins: ${users.filter(u => u.admin?.global).length}`
    )
    console.log(
      `- Creators/Builders: ${users.filter(u => u.builder?.global || u.builder?.creator).length}`
    )
    console.log(
      `- App users: ${users.filter(u => u.roles && Object.keys(u.roles).length > 0).length}`
    )
  } catch (error) {
    console.error("Export failed:", error.message)
    process.exit(1)
  }
}

// Import users to target instance
async function importUsers(options) {
  console.log("Starting user import...")

  const targetUrl = options.target || process.env.TARGET_URL
  const targetApiKey = options.apiKey || process.env.TARGET_API_KEY
  const inputPath = options.input || "users-export.json"
  const dryRun = options.dryRun || false

  if (!targetUrl || !targetApiKey) {
    console.error(
      "Error: Target URL and API key are required. Provide via --target and --api-key or set TARGET_URL and TARGET_API_KEY environment variables."
    )
    process.exit(1)
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`)
    process.exit(1)
  }

  const client = new BudibaseClient(targetUrl, targetApiKey)

  try {
    // Load export data
    console.log(`Loading export data from ${inputPath}...`)
    const exportData = JSON.parse(fs.readFileSync(inputPath, "utf-8"))
    console.log(
      `Loaded ${exportData.users.length} users from export (dated ${exportData.exportDate})`
    )

    if (dryRun) {
      console.log("\n=== DRY RUN MODE - No changes will be made ===\n")
    }

    // Fetch target apps for mapping
    console.log("Fetching target applications...")
    const appsResponse = await client.getApps()
    const targetApps = appsResponse.data || []
    console.log(`Found ${targetApps.length} applications in target instance`)

    // Create app name to ID mapping for target
    const targetAppMapping = {}
    for (const app of targetApps) {
      targetAppMapping[app.name] = app._id
    }

    // Note: Role IDs are standardized (BASIC, POWER, ADMIN) and can be used directly

    // Check for existing users
    console.log("Checking for existing users...")
    const existingUsersResponse = await client.getUsers()
    const existingUsers = existingUsersResponse.data || []
    const existingEmails = new Set(
      existingUsers.map(u => u.email.toLowerCase())
    )

    const results = {
      success: [],
      skipped: [],
      failed: [],
    }

    // Process each user
    console.log("\nProcessing users...")
    for (const user of exportData.users) {
      const email = user.email

      // Skip if user already exists
      if (existingEmails.has(email.toLowerCase())) {
        console.log(`⚠ Skipping ${email} - already exists`)
        results.skipped.push({ email, reason: "User already exists" })
        continue
      }

      // Map roles from source to target
      // Role IDs (BASIC, POWER, ADMIN) are standardized and can be used directly
      const mappedRoles = {}
      let rolesMapped = true

      if (user.rolesMapped && Object.keys(user.rolesMapped).length > 0) {
        for (const [appName, roleId] of Object.entries(user.rolesMapped)) {
          const targetAppId = targetAppMapping[appName]
          if (!targetAppId) {
            console.log(
              `⚠ Warning: App "${appName}" not found in target instance for user ${email}`
            )
            rolesMapped = false
            continue
          }

          // Use the role ID directly (BASIC, POWER, ADMIN are standardized)
          mappedRoles[targetAppId] = roleId
        }
      }

      // Generate temporary password
      const tempPassword = generatePassword()

      // Create user object
      const newUser = {
        email: user.email,
        password: tempPassword,
        roles: mappedRoles,
        status: user.status || "active",
      }

      if (user.firstName) newUser.firstName = user.firstName
      if (user.lastName) newUser.lastName = user.lastName
      if (user.builder) newUser.builder = user.builder
      if (user.admin) newUser.admin = user.admin

      if (dryRun) {
        console.log(
          `✓ Would create user: ${email} (${Object.keys(mappedRoles).length} app roles)`
        )
        results.success.push({ email, dryRun: true })
      } else {
        try {
          await client.createUser(newUser)
          console.log(
            `✓ Created user: ${email} (${Object.keys(mappedRoles).length} app roles)`
          )
          results.success.push({
            email,
            tempPassword,
            rolesMapped: rolesMapped && Object.keys(mappedRoles).length > 0,
          })
        } catch (error) {
          console.error(`✗ Failed to create user ${email}: ${error.message}`)
          results.failed.push({ email, reason: error.message })
        }
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60))
    console.log("Import Summary")
    console.log("=".repeat(60))
    console.log(`Total users processed: ${exportData.users.length}`)
    console.log(`Successfully created: ${results.success.length}`)
    console.log(`Skipped: ${results.skipped.length}`)
    console.log(`Failed: ${results.failed.length}`)

    if (results.failed.length > 0) {
      console.log("\nFailed users:")
      results.failed.forEach(r => console.log(`  - ${r.email}: ${r.reason}`))
    }

    if (!dryRun && results.success.length > 0) {
      // Save passwords to file
      const passwordsPath = inputPath.replace(".json", "-passwords.json")
      fs.writeFileSync(
        passwordsPath,
        JSON.stringify(
          {
            generatedDate: new Date().toISOString(),
            passwords: results.success.map(r => ({
              email: r.email,
              tempPassword: r.tempPassword,
            })),
          },
          null,
          2
        )
      )
      console.log(
        `\n⚠ IMPORTANT: Temporary passwords saved to ${passwordsPath}`
      )
      console.log("Please securely share these passwords with users.")
    }

    if (dryRun) {
      console.log(
        "\n=== DRY RUN COMPLETE - Run without --dry-run to apply changes ==="
      )
    }
  } catch (error) {
    console.error("Import failed:", error.message)
    process.exit(1)
  }
}

// Generate random password
function generatePassword(length = 16) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// CLI setup
program
  .name("migrate-users")
  .description("Migrate Budibase users between instances")
  .version("1.0.0")

program
  .command("export")
  .description("Export users from a Budibase instance")
  .option(
    "-s, --source <url>",
    "Source instance URL (e.g., http://localhost:10000)"
  )
  .option("-k, --api-key <key>", "Source instance API key")
  .option("-o, --output <path>", "Output file path", "users-export.json")
  .action(exportUsers)

program
  .command("import")
  .description("Import users to a Budibase instance")
  .option(
    "-t, --target <url>",
    "Target instance URL (e.g., http://localhost:10001)"
  )
  .option("-k, --api-key <key>", "Target instance API key")
  .option("-i, --input <path>", "Input file path", "users-export.json")
  .option("-d, --dry-run", "Preview changes without applying them")
  .action(importUsers)

program.parse()
