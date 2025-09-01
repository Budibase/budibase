import { appStore } from "@/stores"
import { get } from "svelte/store"

let qrcodePromise: Promise<any> | null = null

export async function loadQRCode(): Promise<any> {
  if (qrcodePromise) {
    return qrcodePromise
  }

  if (typeof window !== "undefined" && window._qrcode) {
    return window._qrcode
  }

  qrcodePromise = new Promise((resolve, reject) => {
    const { appId } = get(appStore)

    if (typeof window === "undefined") {
      reject(new Error("QRCode requires browser environment"))
      return
    }

    const script = document.createElement("script")
    script.src = `/api/assets/html5-qrcode.js?appId=${appId}`
    script.onload = () => {
      if (window._qrcode) {
        resolve(window._qrcode)
      } else {
        reject(new Error("Failed to load QRCode"))
      }
    }
    script.onerror = () => {
      reject(new Error("Failed to load QRCode script"))
    }

    document.head.appendChild(script)
  })

  return qrcodePromise
}
