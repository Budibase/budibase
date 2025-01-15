export const suppressWarnings = (warnings: string[]) => {
  if (!warnings?.length) {
    return
  }
  const regex = new RegExp(warnings.map(x => `(${x})`).join("|"), "gi")
  const warn = console.warn
  console.warn = (...params) => {
    const msg = params[0]
    if (msg && typeof msg === "string") {
      if (msg.match(regex)) {
        return
      }
    }
    warn(...params)
  }
}
