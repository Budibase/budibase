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

export async function downloadStream(filename, streamResponse) {
  const blob = await streamResponse.blob()
  const resBlob = new Blob([blob])

  const blobUrl = URL.createObjectURL(resBlob)

  const link = document.createElement("a")
  link.href = blobUrl
  link.download = filename
  link.click()

  URL.revokeObjectURL(blobUrl)
}
