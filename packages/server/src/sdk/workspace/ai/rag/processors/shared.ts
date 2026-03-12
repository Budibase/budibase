const DEFAULT_CHUNK_SIZE = 1500
const DEFAULT_CHUNK_OVERLAP = 200

export const getFileExtension = (filename?: string) =>
  (filename?.split(".").pop() || "").toLowerCase()

export const chunkDocument = (
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP
) => {
  const normalized = text.replace(/\r\n/g, "\n")
  const chunks: string[] = []
  let start = 0

  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length)
    const chunk = normalized.slice(start, end).trim()
    if (chunk) {
      chunks.push(chunk)
    }
    if (end === normalized.length) {
      break
    }
    start = Math.max(0, end - overlap)
    if (start >= normalized.length) {
      break
    }
  }

  return chunks
}

export const getDefaultChunkSize = () => DEFAULT_CHUNK_SIZE
