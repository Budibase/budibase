#!/usr/bin/env node

import { spawn } from "child_process"
import fs from "fs"
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
  case "analyze":
    analyzeApp(nonFlagArgs[1])
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
          BUDIBASE_INCLUDE_CHARTBLOCK: analysis.usesChartBlock ? "true" : "false",
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

function analyzeApp(appFilePath) {
  if (!appFilePath) {
    console.error("Usage: node cli.js analyze <app-definition.json>")
    process.exit(1)
  }

  try {
    const appDefinition = JSON.parse(fs.readFileSync(appFilePath, "utf8"))
    const analysis = analyzeAppComponents(appDefinition)

    console.log("\n--- App Analysis Results ---")
    console.log(`Total components: ${analysis.totalComponents}`)
    console.log(`Used components: ${analysis.usedComponents.join(", ")}`)
    console.log("\nFeature usage:")
    console.log(`  Charts: ${analysis.usesCharts}`)
    console.log(`  Forms: ${analysis.usesForms}`)
    console.log(`  Blocks: ${analysis.usesBlocks}`)

    console.log("\nRecommended environment flags:")
    console.log(`  BUDIBASE_INCLUDE_CHARTS=${analysis.usesCharts}`)
    console.log(`  BUDIBASE_INCLUDE_FORMS=${analysis.usesForms}`)
    console.log(`  BUDIBASE_INCLUDE_BLOCKS=${analysis.usesBlocks}`)
  } catch (error) {
    console.error("Error analyzing app:", error.message)
    process.exit(1)
  }
}

function analyzeAppComponents(appDefinition) {
  const usedComponents = new Set()

  const scanComponent = component => {
    if (!component) return

    if (component._component) {
      // Extract component type from full component path
      const componentType = component._component.split("/").pop()
      if (componentType) {
        usedComponents.add(componentType)
      }
    }

    // Recursively scan children
    if (component._children) {
      component._children.forEach(scanComponent)
    }
  }

  // Scan all screens and layouts
  if (appDefinition.layouts) {
    Object.values(appDefinition.layouts).forEach(layout => {
      if (layout.props) {
        scanComponent(layout.props)
      }
    })
  }

  if (appDefinition.screens) {
    Object.values(appDefinition.screens).forEach(screen => {
      if (screen.props) {
        scanComponent(screen.props)
      }
    })
  }

  // Define component categories
  const chartComponents = [
    "bar",
    "line",
    "area",
    "pie",
    "donut",
    "candlestick",
    "histogram",
  ]
  const formComponents = [
    "form",
    "formstep",
    "fieldgroup",
    "labelfield",
    "stringfield",
    "numberfield",
    "bigintfield",
    "passwordfield",
    "optionsfield",
    "multifieldselect",
    "booleanfield",
    "longformfield",
    "datetimefield",
    "codescanner",
    "signaturesinglefield",
    "attachmentfield",
    "attachmentsinglefield",
    "relationshipfield",
    "jsonfield",
    "s3upload",
    "bbreferencefield",
    "bbreferencesinglefield",
    "ratingfield",
  ]
  const blockComponents = [
    "chartblock",
    "cardsblock",
    "repeaterblock",
    "multistepformblock",
    "formblock",
    "rowexplorer",
  ]

  // Determine which categories are used
  const analysis = {
    usesCharts: chartComponents.some(comp => usedComponents.has(comp)),
    usesForms: formComponents.some(comp => usedComponents.has(comp)),
    usesBlocks: blockComponents.some(comp => usedComponents.has(comp)),
    usedComponents: Array.from(usedComponents),
    totalComponents: usedComponents.size,
  }

  return analysis
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
