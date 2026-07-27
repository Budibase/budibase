import { PreviewDevice } from "@budibase/types"

const PREVIEW_DEVICE_ORDER: PreviewDevice[] = ["desktop", "tablet", "mobile"]

export const getNextPreviewDevice = (
  device: PreviewDevice | null | undefined
): PreviewDevice => {
  const currentIndex = PREVIEW_DEVICE_ORDER.indexOf(device || "desktop")
  const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex
  const nextIndex = (safeCurrentIndex + 1) % PREVIEW_DEVICE_ORDER.length
  return PREVIEW_DEVICE_ORDER[nextIndex]
}

export const getPreviewDeviceIcon = (
  device: PreviewDevice | null | undefined
): string => {
  if (device === "mobile") {
    return "device-mobile-camera"
  }
  if (device === "tablet") {
    return "device-tablet-camera"
  }
  return "monitor"
}

export const getPreviewModalDevice = (
  device: PreviewDevice | null | undefined
): PreviewDevice | null => {
  return device && device !== "desktop" ? device : null
}
