export function downloadText(filename, text) {
  if (typeof text === "object") {
    text = JSON.stringify(text)
  }
  const blob = new Blob([text], { type: "plain/text" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
