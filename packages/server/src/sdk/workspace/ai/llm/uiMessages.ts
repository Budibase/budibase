import { LLMResponse } from "@budibase/types"
import {
  convertToModelMessages,
  isFileUIPart,
  isTextUIPart,
  ModelMessage,
  UIMessage,
} from "ai"
import { Readable } from "stream"

const DATA_URL_PATTERN = /^data:([^;,]+);base64,(.+)$/s

const isImageMediaType = (mediaType?: string) =>
  Boolean(mediaType?.toLowerCase().startsWith("image/"))

const isTextMediaType = (mediaType?: string) =>
  Boolean(mediaType?.toLowerCase().startsWith("text/"))

const dataUrlToBuffer = (dataUrl: string) => {
  const match = dataUrl.match(DATA_URL_PATTERN)
  if (!match) {
    throw new Error("Only base64 data URLs are supported for AI file uploads")
  }

  return {
    mediaType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  }
}

const dataUrlToText = (dataUrl: string) => {
  const { buffer } = dataUrlToBuffer(dataUrl)
  return buffer.toString("utf8")
}

export async function normalizeUIMessagesToModelMessages(
  messages: UIMessage[],
  llm?: Pick<LLMResponse, "uploadFile">
): Promise<ModelMessage[]> {
  const normalized: ModelMessage[] = []

  for (const message of messages) {
    if (
      message.role !== "user" ||
      !Array.isArray(message.parts) ||
      !message.parts.some(isFileUIPart)
    ) {
      normalized.push(...(await convertToModelMessages([message])))
      continue
    }

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: URL; mediaType?: string }
      | { type: "file"; data: string | URL; filename?: string; mediaType: string }
    > = []

    for (const part of message.parts) {
      if (isTextUIPart(part)) {
        content.push({
          type: "text",
          text: part.text,
        })
        continue
      }

      if (!isFileUIPart(part)) {
        continue
      }

      if (isImageMediaType(part.mediaType)) {
        content.push({
          type: "image",
          image: new URL(part.url),
          ...(part.mediaType ? { mediaType: part.mediaType } : {}),
        })
        continue
      }

      if (isTextMediaType(part.mediaType) && part.url.startsWith("data:")) {
        const text = dataUrlToText(part.url).trim()
        content.push({
          type: "text",
          text: part.filename
            ? `Attached file (${part.filename}):\n${text}`
            : text,
        })
        continue
      }

      let data = part.url
      let mediaType = part.mediaType

      if (llm?.uploadFile && part.url.startsWith("data:")) {
        try {
          const parsed = dataUrlToBuffer(part.url)
          mediaType = mediaType || parsed.mediaType
          data = await llm.uploadFile(
            Readable.from(parsed.buffer),
            part.filename || "attachment",
            mediaType
          )
        } catch (error) {
          console.error("Failed to upload AI file attachment", error)
        }
      }

      content.push({
        type: "file",
        data,
        filename: part.filename,
        mediaType: mediaType || "application/octet-stream",
      })
    }

    normalized.push({
      role: "user",
      content,
    })
  }

  return normalized
}
