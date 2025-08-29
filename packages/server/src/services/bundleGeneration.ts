import path from "path"
import fs from "fs"
import { spawn } from "child_process"
import { App } from "@budibase/types"
import env from "../environment"

interface ComponentAnalysis {
  usesCharts: boolean
  usesForms: boolean
  usesBlocks: boolean
  usedComponents: string[]
  totalComponents: number
}

interface BuildFlags {
  BUDIBASE_INCLUDE_CHARTS: string
  BUDIBASE_INCLUDE_FORMS: string
  BUDIBASE_INCLUDE_BLOCKS: string
}

export class BundleGenerationService {
  private static bundleCache = new Map<string, string>()

  /**
   * Analyzes an app definition to determine which component categories are used
   */
  private analyzeAppComponents(appDefinition: App): ComponentAnalysis {
    const usedComponents = new Set<string>()

    const scanComponent = (component: any) => {
      if (!component) return

      if (component._component) {
        // Extract component type from full component path
        // e.g., "@budibase/standard-components/bar" -> "bar"
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
    const appDefinitionAny = appDefinition as any

    if (appDefinitionAny.layouts) {
      Object.values(appDefinitionAny.layouts).forEach((layout: any) => {
        if (layout.props) {
          scanComponent(layout.props)
        }
      })
    }

    if (appDefinitionAny.screens) {
      Object.values(appDefinitionAny.screens).forEach((screen: any) => {
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
      usesCharts:
        chartComponents.some(comp => usedComponents.has(comp)) || true,
      usesForms: formComponents.some(comp => usedComponents.has(comp)),
      usesBlocks: blockComponents.some(comp => usedComponents.has(comp)),
      usedComponents: Array.from(usedComponents),
      totalComponents: usedComponents.size,
    }

    return analysis
  }

  /**
   * Generates build flags based on component analysis
   */
  private generateBuildFlags(analysis: ComponentAnalysis): BuildFlags {
    return {
      BUDIBASE_INCLUDE_CHARTS: analysis.usesCharts ? "true" : "false",
      BUDIBASE_INCLUDE_FORMS: analysis.usesForms ? "true" : "false",
      BUDIBASE_INCLUDE_BLOCKS: analysis.usesBlocks ? "true" : "false",
    }
  }

  /**
   * Generates a cache key for the bundle based on component usage
   */
  private generateBundleKey(analysis: ComponentAnalysis): string {
    const flags = [
      analysis.usesCharts ? "C" : "",
      analysis.usesForms ? "F" : "",
      analysis.usesBlocks ? "B" : "",
    ].join("")

    return `bundle-${flags || "minimal"}`
  }

  /**
   * Gets the path to the client package where bundle generation should occur
   */
  private getClientPackagePath(): string {
    if (env.isDev()) {
      // In development, use the relative path to the client package
      return path.join(process.cwd(), "..", "client")
    } else {
      // In production, the client package should be installed as a dependency
      // and available via node_modules
      try {
        return path.dirname(require.resolve("@budibase/client/package.json"))
      } catch (error) {
        // Fallback to assuming client is in the same directory structure
        return path.join(process.cwd(), "client")
      }
    }
  }

  /**
   * Gets the path where the generated bundle should be placed
   * This integrates with the existing updateClientLibrary system
   */
  private getBundleOutputPath(): string {
    const clientPath = this.getClientPackagePath()
    return path.join(clientPath, "dist", "budibase-client.js")
  }

  /**
   * Trims unused modules from the full bundle using the CLI trim command (Step 2)
   */
  private async trimBundle(analysis: ComponentAnalysis): Promise<void> {
    const clientPath = this.getClientPackagePath()
    const cliPath = path.join(clientPath, "cli.js")

    // Check if CLI exists
    // @ts-ignore
    if (!fs.existsSync(cliPath)) {
      throw new Error(`Client CLI not found at ${cliPath}`)
    }

    // Create analysis JSON for CLI
    const analysisJson = JSON.stringify({
      usesCharts: analysis.usesCharts,
      usesForms: analysis.usesForms,
      usesBlocks: analysis.usesBlocks,
    })

    console.log(`Trimming bundle with analysis: ${analysisJson}`)

    return new Promise((resolve, reject) => {
      const trimProcess = spawn("node", [cliPath, "trim", analysisJson], {
        cwd: clientPath,
        stdio: ["inherit", "pipe", "pipe"],
      })

      let stdout = ""
      let stderr = ""

      trimProcess.stdout?.on("data", data => {
        stdout += data.toString()
      })

      trimProcess.stderr?.on("data", data => {
        stderr += data.toString()
      })

      trimProcess.on("close", code => {
        if (code === 0) {
          console.log("Bundle trimming completed successfully")
          resolve()
        } else {
          console.log(`Bundle trimming failed with code ${code}: ${stderr}`)
          reject(
            new Error(`Bundle trimming failed with code ${code}: ${stderr}`)
          )
        }
      })

      trimProcess.on("error", err => {
        console.log(`Bundle trimming process error: ${err.message}`)
        reject(err)
      })
    })
  }

  /**
   * Generates an optimized bundle for a specific app
   * The bundle replaces the default client bundle and will be used by updateClientLibrary
   */
  async generateOptimizedBundle(
    appDefinition: App,
    appId: string
  ): Promise<void> {
    try {
      // Analyze the app to determine component usage
      const analysis = this.analyzeAppComponents(appDefinition)
      const bundleKey = this.generateBundleKey(analysis)

      // Check if we need to generate a new bundle (simple caching based on bundle key)
      // const lastBundleKey = BundleGenerationService.bundleCache.get(appId)
      // if (lastBundleKey === bundleKey) {
      //   console.log(`Bundle for app ${appId} is already optimized (${bundleKey})`)
      //   return
      // }

      // Generate new optimized bundle
      console.log(`Generating optimized bundle: ${bundleKey} for app ${appId}`)
      console.log(
        `Component analysis: ${analysis.totalComponents} total, charts: ${analysis.usesCharts}, forms: ${analysis.usesForms}, blocks: ${analysis.usesBlocks}`
      )

      // Trim unused modules based on analysis (compiled modules already exist)
      await this.trimBundle(analysis)

      // Cache the bundle key for this app
      BundleGenerationService.bundleCache.set(appId, bundleKey)

      console.log(`Optimized bundle generated for app ${appId}`)
    } catch (error) {
      console.log(
        `Failed to generate optimized bundle for app ${appId}: ${error}`
      )
      throw error
    }
  }

  /**
   * Clears the bundle optimization cache
   */
  clearCache(): void {
    BundleGenerationService.bundleCache.clear()
    console.log("Bundle optimization cache cleared")
  }
}

// Export singleton instance
export const bundleGenerationService = new BundleGenerationService()
