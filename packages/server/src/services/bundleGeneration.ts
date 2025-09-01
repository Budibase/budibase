import path from "path"
import fs from "fs"
import { spawn } from "child_process"
import { Screen } from "@budibase/types"
import env from "../environment"
import sdk from "../sdk"

interface ComponentAnalysis {
  usesCharts: boolean
  usedComponents: string[]
  totalComponents: number
}

export class BundleGenerationService {
  private static bundleCache = new Map<string, string>()

  private analyseAppComponents(screens: Screen[]): ComponentAnalysis {
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

      if (component._children) {
        component._children.forEach(scanComponent)
      }
    }

    Object.values(screens).forEach((screen: any) => {
      if (screen.props) {
        scanComponent(screen.props)
      }
    })

    const chartComponents = [
      "chartblock",
      "bar",
      "line",
      "area",
      "pie",
      "donut",
      "candlestick",
      "histogram",
    ]
    const analysis = {
      usesCharts: chartComponents.some(comp => usedComponents.has(comp)),
      usedComponents: Array.from(usedComponents),
      totalComponents: usedComponents.size,
    }

    return analysis
  }

  /**
   * Generates a cache key for the bundle based on component usage
   */
  private generateBundleKey(analysis: ComponentAnalysis): string {
    const flags = [analysis.usesCharts ? "C" : ""].join("")

    return `bundle-${flags}`
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
   * Trims unused modules from the full bundle using the CLI trim command (Step 2)
   */
  private async trimBundle(analysis: ComponentAnalysis): Promise<void> {
    const clientPath = this.getClientPackagePath()
    const cliPath = path.join(clientPath, "cli.js")

    if (!fs.existsSync(cliPath)) {
      throw new Error(`Client CLI not found at ${cliPath}`)
    }

    const analysisJson = JSON.stringify({
      usesCharts: analysis.usesCharts,
    })

    console.log(`Trimming bundle with analysis: ${analysisJson}`)

    return new Promise((resolve, reject) => {
      const trimProcess = spawn("node", [cliPath, "trim", analysisJson], {
        cwd: clientPath,
        stdio: ["inherit", "pipe", "pipe"],
      })

      let stderr = ""

      trimProcess.stdout?.on("data", data => {
        console.log(data.toString().trim())
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
  async generateOptimizedBundle(appId: string): Promise<void> {
    try {
      let screens = await sdk.screens.fetch()
      const apps = await sdk.workspaceApps.fetch()
      screens = screens.filter(s =>
        apps
          .filter(a => !a.disabled)
          .map(a => a._id)
          .includes(s.workspaceAppId)
      )

      const analysis = this.analyseAppComponents(screens)
      const bundleKey = this.generateBundleKey(analysis)

      // Check if we need to generate a new bundle (simple caching based on bundle key)
      // const lastBundleKey = BundleGenerationService.bundleCache.get(appId)
      // if (lastBundleKey === bundleKey) {
      //   console.log(`Bundle for app ${appId} is already optimized (${bundleKey})`)
      //   return
      // }

      console.log(`Generating optimized bundle: ${bundleKey} for app ${appId}`)
      console.log(
        `Component analysis: ${analysis.totalComponents} total, charts: ${analysis.usesCharts}`
      )

      await this.trimBundle(analysis)

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
