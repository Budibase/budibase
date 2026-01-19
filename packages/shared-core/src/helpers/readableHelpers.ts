export function formatBytes(bytes: string | number | undefined, spacer = "") {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const byteIncrements = 1024
  let unit = 0
  let size = typeof bytes === "string" ? parseInt(bytes, 10) : bytes || 0
  while (size >= byteIncrements && unit < units.length - 1 && ++unit) {
    size /= byteIncrements
  }
  return `${size.toFixed(size < 10 && unit > 0 ? 1 : 0)}${spacer}${units[unit]}`
}
