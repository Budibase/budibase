import { appStore } from "@/stores"
import { get } from "svelte/store"

const loadedDependencies = new Map<string, Promise<any>>()

interface DependencyConfig {
  name: string
  scriptName: string
  globalProperty: string
}

export async function loadDependency(config: DependencyConfig): Promise<any> {
  const { name, scriptName, globalProperty } = config

  if (loadedDependencies.has(name)) {
    return loadedDependencies.get(name)!
  }

  if (typeof window !== "undefined" && (window as any)[globalProperty]) {
    return (window as any)[globalProperty]
  }

  const promise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error(`${scriptName} requires browser environment`))
      return
    }

    const { appId } = get(appStore)
    const script = document.createElement("script")
    script.src = `/api/assets/${scriptName}?appId=${appId}`
    script.onload = () => {
      if ((window as any)[globalProperty]) {
        resolve((window as any)[globalProperty])
      } else {
        reject(new Error(`Failed to load ${scriptName}`))
      }
    }
    script.onerror = () => {
      reject(new Error(`Failed to load ${scriptName} script`))
    }

    document.head.appendChild(script)
  })

  loadedDependencies.set(name, promise)
  return promise
}

// Specific loaders
export async function loadCharts(): Promise<any> {
  return loadDependency({
    name: "charts",
    scriptName: "apexcharts.js",
    globalProperty: "_charts",
  })
}

export async function loadQRCode(): Promise<any> {
  return loadDependency({
    name: "qrcode",
    scriptName: "html5-qrcode.js",
    globalProperty: "_qrcode",
  })
}
