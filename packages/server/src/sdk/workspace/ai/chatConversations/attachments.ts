import { buffer as consumeBuffer } from "node:stream/consumers"
import { context, HTTPError, objectStore, utils } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationAttachment,
} from "@budibase/types"
import type { ModelMessage, UserContent } from "ai"
import { PDFParse } from "pdf-parse"
import { ObjectStoreBuckets } from "../../../../constants"

export const MAX_CONVERSATION_ATTACHMENT_COUNT = 3
export const MAX_CONVERSATION_ATTACHMENT_BYTES = 10 * 1024 * 1024
export const MAX_CONVERSATION_ATTACHMENT_TEXT_LENGTH = 200_000
export const MAX_CONVERSATION_ATTACHMENT_PDF_PAGES = 50

const TEXT_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "text/tab-separated-values",
  "application/json",
  "application/yaml",
  "text/yaml",
  "application/xml",
  "text/xml",
])
const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"])
const SUPPORTED_MIME_TYPES = new Set([
  ...TEXT_MIME_TYPES,
  ...IMAGE_MIME_TYPES,
  "application/pdf",
])
const MIME_TYPE_EXTENSIONS = new Map<string, Set<string>>([
  ["text/plain", new Set([".txt"])],
  ["text/markdown", new Set([".md", ".markdown"])],
  ["text/csv", new Set([".csv"])],
  ["text/tab-separated-values", new Set([".tsv"])],
  ["application/json", new Set([".json"])],
  ["application/yaml", new Set([".yaml", ".yml"])],
  ["text/yaml", new Set([".yaml", ".yml"])],
  ["application/xml", new Set([".xml"])],
  ["text/xml", new Set([".xml"])],
  ["image/png", new Set([".png"])],
  ["image/jpeg", new Set([".jpg", ".jpeg"])],
  ["image/jpg", new Set([".jpg", ".jpeg"])],
  ["application/pdf", new Set([".pdf"])],
])

export interface IncomingConversationAttachment {
  providerFileId: string
  filename: string
  mimetype: string
  size?: number
  fetchData?: () => Promise<Buffer>
}

const normalizeMimetype = (mimetype: string) =>
  mimetype.split(";", 1)[0].trim().toLowerCase()

export const getConversationAttachmentObjectStoreKey = ({
  workspaceId,
  conversationId,
  attachmentId,
}: {
  workspaceId: string
  conversationId: string
  attachmentId: string
}) =>
  `${workspaceId}/ai/chat-conversations/${encodeURIComponent(
    conversationId
  )}/attachments/${encodeURIComponent(attachmentId)}`

const assertSupportedMetadata = (
  attachment: IncomingConversationAttachment
) => {
  if (!attachment.providerFileId.trim()) {
    throw new HTTPError("Slack file ID is required", 400)
  }
  if (!attachment.filename.trim()) {
    throw new HTTPError("Slack filename is required", 400)
  }
  if (!attachment.size || attachment.size <= 0) {
    throw new HTTPError(
      `Slack did not provide a valid size for ${attachment.filename}`,
      400
    )
  }
  if (!attachment.fetchData) {
    throw new HTTPError(`${attachment.filename} cannot be downloaded`, 400)
  }
  const mimetype = normalizeMimetype(attachment.mimetype)
  if (!SUPPORTED_MIME_TYPES.has(mimetype)) {
    throw new HTTPError(
      `${attachment.filename} has an unsupported file type`,
      400
    )
  }
  const dotIndex = attachment.filename.lastIndexOf(".")
  const extension =
    dotIndex >= 0 ? attachment.filename.slice(dotIndex).toLowerCase() : ""
  if (!MIME_TYPE_EXTENSIONS.get(mimetype)?.has(extension)) {
    throw new HTTPError(
      `${attachment.filename} does not match its reported file type`,
      400
    )
  }
}

const hasPrefix = (data: Buffer, prefix: number[]) =>
  prefix.every((byte, index) => data[index] === byte)

const validateFileContent = async ({
  data,
  filename,
  mimetype,
}: {
  data: Buffer
  filename: string
  mimetype: string
}) => {
  if (mimetype === "application/pdf") {
    if (!hasPrefix(data, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
      throw new HTTPError(`${filename} is not a valid PDF`, 400)
    }
    const parser = new PDFParse({ data: Uint8Array.from(data) })
    try {
      const info = await parser.getInfo()
      if (info.total > MAX_CONVERSATION_ATTACHMENT_PDF_PAGES) {
        throw new HTTPError(
          `${filename} exceeds the ${MAX_CONVERSATION_ATTACHMENT_PDF_PAGES}-page limit`,
          400
        )
      }
    } finally {
      await parser.destroy()
    }
    return
  }

  if (mimetype === "image/png") {
    if (!hasPrefix(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
      throw new HTTPError(`${filename} is not a valid PNG image`, 400)
    }
    return
  }

  if (IMAGE_MIME_TYPES.has(mimetype)) {
    if (!hasPrefix(data, [0xff, 0xd8, 0xff])) {
      throw new HTTPError(`${filename} is not a valid JPEG image`, 400)
    }
    return
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(data).length
  } catch {
    throw new HTTPError(`${filename} is not valid UTF-8 text`, 400)
  }
}

export const uploadConversationAttachments = async ({
  conversation,
  incoming,
}: {
  conversation: Pick<ChatConversation, "_id" | "attachments">
  incoming: IncomingConversationAttachment[]
}): Promise<ChatConversationAttachment[]> => {
  const conversationId = conversation._id
  if (!conversationId) {
    throw new HTTPError("Conversation ID is required", 400)
  }

  const existing = conversation.attachments || []
  const existingProviderIds = new Set(existing.map(file => file.providerFileId))
  const incomingByProviderId = new Map(
    incoming.map(file => [file.providerFileId, file])
  )
  const deduplicated = [...incomingByProviderId.values()].filter(
    file => !existingProviderIds.has(file.providerFileId)
  )
  if (!deduplicated.length) {
    return []
  }

  deduplicated.forEach(assertSupportedMetadata)
  const nextCount = existing.length + deduplicated.length
  const nextSize =
    existing.reduce((total, file) => total + file.size, 0) +
    deduplicated.reduce((total, file) => total + file.size!, 0)
  if (nextCount > MAX_CONVERSATION_ATTACHMENT_COUNT) {
    throw new HTTPError(
      `A conversation can contain at most ${MAX_CONVERSATION_ATTACHMENT_COUNT} files. Use /new to start another conversation.`,
      400
    )
  }
  if (nextSize > MAX_CONVERSATION_ATTACHMENT_BYTES) {
    throw new HTTPError(
      "Conversation files cannot exceed 10 MB in total. Use /new to start another conversation.",
      400
    )
  }

  const workspaceId = context.getOrThrowWorkspaceId()
  const uploaded: ChatConversationAttachment[] = []
  let textLength = existing.reduce(
    (total, attachment) => total + (attachment.textLength || 0),
    0
  )
  try {
    for (const input of deduplicated) {
      const data = await input.fetchData!()
      if (data.byteLength !== input.size) {
        throw new HTTPError(
          `${input.filename} did not match the size reported by Slack`,
          400
        )
      }
      const mimetype = normalizeMimetype(input.mimetype)
      const attachmentTextLength = await validateFileContent({
        data,
        filename: input.filename,
        mimetype,
      })
      textLength += attachmentTextLength || 0
      if (textLength > MAX_CONVERSATION_ATTACHMENT_TEXT_LENGTH) {
        throw new HTTPError(
          "Conversation text attachments exceed the 200,000-character limit. Use /new to start another conversation.",
          400
        )
      }

      const attachment: ChatConversationAttachment = {
        id: utils.newid(),
        provider: AgentChannelProvider.SLACK,
        providerFileId: input.providerFileId,
        filename: input.filename.trim(),
        mimetype,
        size: data.byteLength,
        textLength: attachmentTextLength,
        uploadedAt: new Date().toISOString(),
      }
      await objectStore.upload({
        bucket: ObjectStoreBuckets.APPS,
        filename: getConversationAttachmentObjectStoreKey({
          workspaceId,
          conversationId,
          attachmentId: attachment.id,
        }),
        body: data,
        type: mimetype,
      })
      uploaded.push(attachment)
    }
    return uploaded
  } catch (error) {
    await deleteConversationAttachmentObjects({
      conversationId,
      attachments: uploaded,
    }).catch(cleanupError => {
      console.error(
        "Failed to roll back conversation attachments",
        cleanupError
      )
    })
    throw error
  }
}

export const deleteConversationAttachmentObjects = async ({
  conversationId,
  attachments,
}: {
  conversationId: string
  attachments: ChatConversationAttachment[]
}) => {
  if (!attachments.length) {
    return
  }
  const workspaceId = context.getOrThrowWorkspaceId()
  await objectStore.deleteFiles(
    ObjectStoreBuckets.APPS,
    attachments.map(attachment =>
      getConversationAttachmentObjectStoreKey({
        workspaceId,
        conversationId,
        attachmentId: attachment.id,
      })
    )
  )
}

const readAttachment = async ({
  conversationId,
  attachment,
}: {
  conversationId: string
  attachment: ChatConversationAttachment
}) => {
  const workspaceId = context.getOrThrowWorkspaceId()
  const { stream } = await objectStore.getReadStream(
    ObjectStoreBuckets.APPS,
    getConversationAttachmentObjectStoreKey({
      workspaceId,
      conversationId,
      attachmentId: attachment.id,
    })
  )
  return await consumeBuffer(stream)
}

export const addConversationAttachmentsToModelMessages = async ({
  messages,
  conversation,
  attachmentIds,
}: {
  messages: ModelMessage[]
  conversation: Pick<ChatConversation, "_id" | "attachments">
  attachmentIds?: string[]
}): Promise<ModelMessage[]> => {
  const conversationId = conversation._id
  if (!conversationId) {
    return messages
  }
  const selectedIds = attachmentIds ? new Set(attachmentIds) : undefined
  const attachments = (conversation.attachments || []).filter(
    attachment => !selectedIds || selectedIds.has(attachment.id)
  )
  if (!attachments.length) {
    return messages
  }

  const content: UserContent = []
  let textLength = 0
  for (const attachment of attachments) {
    const data = await readAttachment({ conversationId, attachment })
    if (TEXT_MIME_TYPES.has(attachment.mimetype)) {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(data)
      textLength += text.length
      if (textLength > MAX_CONVERSATION_ATTACHMENT_TEXT_LENGTH) {
        throw new HTTPError(
          "Conversation text attachments exceed the 200,000-character limit",
          400
        )
      }
      content.push({
        type: "text",
        text: `\n\n<conversation-file name=${JSON.stringify(
          attachment.filename
        )}>\n${text}\n</conversation-file>`,
      })
    } else if (IMAGE_MIME_TYPES.has(attachment.mimetype)) {
      content.push({
        type: "image",
        image: data,
        mediaType: attachment.mimetype,
      })
    } else {
      content.push({
        type: "file",
        data,
        filename: attachment.filename,
        mediaType: attachment.mimetype,
      })
    }
  }

  const lastUserIndex = messages.findLastIndex(
    message => message.role === "user"
  )
  if (lastUserIndex < 0) {
    return [...messages, { role: "user", content }]
  }
  return messages.map((message, index) => {
    if (index !== lastUserIndex || message.role !== "user") {
      return message
    }
    const existingContent: UserContent =
      typeof message.content === "string"
        ? [{ type: "text", text: message.content }]
        : message.content
    return { ...message, content: [...existingContent, ...content] }
  })
}
