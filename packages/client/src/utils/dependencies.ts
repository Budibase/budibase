import { appStore } from "@/stores"
import { libDependencies, LibDependency } from "@budibase/types"
import { get } from "svelte/store"

const loadedDependencies = new Map<string, Promise<any>>()

export async function loadDependency(config: LibDependency): Promise<any> {
  const { outFile, globalProperty } = config

  if (loadedDependencies.has(outFile)) {
    return loadedDependencies.get(outFile)!
  }

  if (typeof window !== "undefined" && (window as any)[globalProperty]) {
    return (window as any)[globalProperty]
  }

  const promise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error(`${outFile} requires browser environment`))
      return
    }

    const { clientCacheKey } = get(appStore)
    const script = document.createElement("script")
    script.src = `/api/assets/${outFile}?${clientCacheKey}&`
    script.onload = () => {
      if ((window as any)[globalProperty]) {
        resolve((window as any)[globalProperty])
      } else {
        reject(new Error(`Failed to load ${outFile}`))
      }
    }
    script.onerror = () => {
      reject(new Error(`Failed to load ${outFile} script`))
    }

    document.head.appendChild(script)
  })

  loadedDependencies.set(outFile, promise)
  return promise
}

// Specific loaders
// eslint-disable-next-line no-undef
export const loadCharts = __USE_DYNAMIC_LOADING__
  ? () => loadDependency(libDependencies.charts)
  : async () => (await import("apexcharts")).default

// eslint-disable-next-line no-undef
export const loadQRCode = __USE_DYNAMIC_LOADING__
  ? () => loadDependency(libDependencies.qrcode)
  : async () => (await import("html5-qrcode")).Html5Qrcode
