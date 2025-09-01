import { appStore } from "@/stores"
import { get } from "svelte/store"

let apexChartsPromise: Promise<any> | null = null

export async function loadCharts(): Promise<any> {
  if (apexChartsPromise) {
    return apexChartsPromise
  }

  if (typeof window !== "undefined" && window._charts) {
    return window._charts
  }

  apexChartsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("ApexCharts requires browser environment"))
      return
    }

    const { appId } = get(appStore)
    const script = document.createElement("script")
    script.src = `/api/assets/apexcharts.js?appId=${appId}`
    script.onload = () => {
      if (window._charts) {
        resolve(window._charts)
      } else {
        reject(new Error("Failed to load ApexCharts"))
      }
    }
    script.onerror = () => {
      reject(new Error("Failed to load ApexCharts script"))
    }

    document.head.appendChild(script)
  })

  return apexChartsPromise
}
