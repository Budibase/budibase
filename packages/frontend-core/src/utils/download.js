const extractFileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/

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

export async function downloadStream(streamResponse) {
  const blob = await streamResponse.blob()

  const contentDisposition = streamResponse.headers.get("Content-Disposition")

  const matches = extractFileNameRegex.exec(contentDisposition)

  const filename = matches[1].replace(/['"]/g, "")

  const resBlob = new Blob([blob])

  const blobUrl = URL.createObjectURL(resBlob)

  const link = document.createElement("a")
  link.href = blobUrl
  link.download = filename
  link.click()

  URL.revokeObjectURL(blobUrl)
}

export async function downloadFile(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return false
  } else {
    const contentDisposition = response.headers.get("Content-Disposition")

    const matches = extractFileNameRegex.exec(contentDisposition)

    const filename = matches[1].replace(/['"]/g, "")

    const url = URL.createObjectURL(await response.blob())

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
    return true
  }
}
