#!/usr/bin/env node

import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse command line arguments
const args = process.argv.slice(2)

// Handle flags and find the actual command
const flags = args.filter(arg => arg.startsWith("--"))
const nonFlagArgs = args.filter(arg => !arg.startsWith("--"))
const command = nonFlagArgs[0]

if (
  !command ||
  command === "help" ||
  flags.includes("--help") ||
  flags.includes("-h")
) {
  showHelp()
  process.exit(0)
}

switch (command) {
  case "trim":
    trimBundle(nonFlagArgs[1])
    break
  default:
    console.error(`Unknown command: ${command}`)
    showHelp()
    process.exit(1)
}

async function trimBundle(analysisData) {
  if (!analysisData) {
    console.error("Usage: node cli.js trim '<analysis-json>'")
    console.error("Example: node cli.js trim '{\"usesCharts\":false}'")
    process.exit(1)
  }

  try {
    let analysis
    try {
      analysis = JSON.parse(analysisData)
    } catch {
      console.error("Invalid JSON provided for analysis")
      process.exit(1)
    }

    console.log("Creating final bundle using Vite based on analysis:", analysis)

    // Use Vite to build the final bundle with conditional module inclusion
    const vitePath = path.join(__dirname, "node_modules", ".bin", "vite")
    const configPath = path.join(__dirname, "vite.trim.config.mjs")

    await new Promise((resolve, reject) => {
      const buildProcess = spawn(vitePath, ["build", "--config", configPath], {
        cwd: __dirname,
        stdio: "inherit",
        env: {
          ...process.env,
          NODE_ENV: "production",
          BUDIBASE_INCLUDE_CHARTS: analysis.usesCharts ? "true" : "false",
        },
      })

      buildProcess.on("close", code => {
        if (code === 0) {
          console.log("✓ Final bundle created successfully using Vite")
          resolve()
        } else {
          reject(new Error(`Bundle creation failed with code ${code}`))
        }
      })

      buildProcess.on("error", err => {
        reject(err)
      })
    })
  } catch (error) {
    console.error("Failed to create final bundle:", error.message)
    process.exit(1)
  }
}

function showHelp() {
  console.log(`
Budibase Client CLI

Usage: 
  Step 1: vite build                    # Compile all modules (no tree shaking)
  Step 2: node cli.js <command>         # Runtime bundling

Commands:
  trim <analysis>        Create final IIFE bundle based on app analysis
  analyze <app.json>     Analyze app definition to determine required components
  help, --help, -h       Show this help message

Examples:
  # Step 1: Compile all modules
  vite build

  # Step 2: Create optimized bundle without charts
  node cli.js trim '{"usesCharts":false,"usesForms":false}'

  # Step 2: Create full bundle with charts and forms
  node cli.js trim '{"usesCharts":true,"usesForms":true}'

  # Analyze an app to determine what's needed
  node cli.js analyze ./my-app.json
`)
}
