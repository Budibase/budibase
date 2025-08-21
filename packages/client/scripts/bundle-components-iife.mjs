import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import { visualizer } from "rollup-plugin-visualizer"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Components to bundle
const COMPONENTS_TO_BUNDLE = ["textv2"]

// Output configuration
const OUTPUT_FILE = "dist/components-bundle.iife.js"
const BUNDLE_NAME = "BudibaseComponents"

/**
 * Creates a virtual entry point that exports all components
 */
function createVirtualEntry() {
  const imports = COMPONENTS_TO_BUNDLE.map(
    (name, index) =>
      `import * as Component${index} from "./dist/components/${name}.js"`
  ).join("\n")

  const exports = COMPONENTS_TO_BUNDLE.map(
    (name, index) => `${name}: Component${index}.default`
  ).join(",\n")

  return `${imports}

window.${BUNDLE_NAME} = {
${exports}
};`
}

/**
 * Custom plugin to handle the virtual entry point
 */
function virtualEntryPlugin() {
  const virtualId = "virtual:components-entry"
  const resolvedVirtualId = "\0" + virtualId

  return {
    name: "virtual-entry",
    resolveId(id) {
      if (id === virtualId) {
        return resolvedVirtualId
      }
    },
    load(id) {
      if (id === resolvedVirtualId) {
        return createVirtualEntry()
      }
    },
  }
}

/**
 * Main bundling function using Rollup
 */
async function bundleComponents() {
  console.log(
    `Bundling components with Rollup: ${COMPONENTS_TO_BUNDLE.join(", ")}`
  )

  try {
    // Verify component files exist
    for (const componentName of COMPONENTS_TO_BUNDLE) {
      const filePath = path.join(
        __dirname,
        "..",
        "dist",
        "components",
        `${componentName}.js`
      )
      if (!fs.existsSync(filePath)) {
        throw new Error(`Component file not found: ${filePath}`)
      }
    }

    console.log(
      `✓ Verified ${COMPONENTS_TO_BUNDLE.length} component files exist`
    )

    // Rollup configuration
    const inputOptions = {
      input: "virtual:components-entry",
      external: ["svelte", "svelte/store", "svelte/internal"],
      plugins: [
        virtualEntryPlugin(),
        nodeResolve({
          browser: true,
          preferBuiltins: false,
        }),
        commonjs(),
      ],
    }

    const outputOptions = {
      file: path.join(__dirname, "..", OUTPUT_FILE),
      format: "iife",
      name: BUNDLE_NAME,
      globals: {
        svelte: "window.svelte",
        "svelte/store": "window.svelte_store",
        "svelte/internal": "window.svelte_internal",
      },
      plugins: [
        visualizer({
          filename: path.join(__dirname, "..", "dist/bundle-analysis.html"),
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
        // terser(),
      ],
      sourcemap: true,
    }

    // Create bundle
    console.log("Building bundle with Rollup...")
    const bundle = await rollup(inputOptions)

    // Generate output
    await bundle.write(outputOptions)

    // Close bundle
    await bundle.close()

    const stats = fs.statSync(path.join(__dirname, "..", OUTPUT_FILE))
    console.log(
      `✓ Bundle created: ${OUTPUT_FILE} (${Math.round(stats.size / 1024)}KB)`
    )

    console.log(`\nBundle contents:`)
    console.log(`- Components: ${COMPONENTS_TO_BUNDLE.join(", ")}`)
    console.log(`- Format: IIFE (no imports)`)
    console.log(`- Global variable: ${BUNDLE_NAME}`)
    console.log(`- Bundle analysis: dist/bundle-analysis.html`)
  } catch (error) {
    console.error("❌ Bundling failed:", error.message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bundleComponents().catch(error => {
    console.error("❌ Script failed:", error)
    process.exit(1)
  })
}

export { bundleComponents }
