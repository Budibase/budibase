let apexChartsPromise: Promise<any> | null = null

export async function loadCharts(appId: string): Promise<any> {
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

    const script = document.createElement("script")
    script.src = `/api/assets/dependencies/apexcharts.js?appId=${appId}`
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
