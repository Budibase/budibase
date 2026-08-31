import { context, HTTPError, objectStore, utils } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationAttachment,
  ConversationAttachmentStatus,
} from "@budibase/types"
import type { ModelMessage, UserContent } from "ai"
import { PDFParse } from "pdf-parse"
import { ObjectStoreBuckets } from "../../../../constants"
import {
  searchGeminiFileStore,
  type RagSearchResultItem,
} from "../knowledgeBase/geminiFileStore"

export const MAX_CONVERSATION_ATTACHMENT_COUNT = 3
export const MAX_CONVERSATION_ATTACHMENT_BYTES = 20 * 1024 * 1024
export const MAX_CONVERSATION_ATTACHMENT_CONTEXT_TOKENS = 12_000
const MAX_CONVERSATION_ATTACHMENT_CONTEXT_CHUNKS = 10
const ESTIMATED_CHARACTERS_PER_TOKEN = 4

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
const SUPPORTED_MIME_TYPES = new Set([...TEXT_MIME_TYPES, "application/pdf"])
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
  ["application/pdf", new Set([".pdf"])],
])

export interface IncomingConversationAttachment {
  providerFileId: string
  filename: string
  mimetype: string
  size?: number
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
  const mimetype = normalizeMimetype(attachment.mimetype)
  if (!SUPPORTED_MIME_TYPES.has(mimetype)) {
    throw new HTTPError(
      `${attachment.filename} has an unsupported file type`,
      400
    )
  }
  if (attachment.size > MAX_CONVERSATION_ATTACHMENT_BYTES) {
    throw new HTTPError(
      `${attachment.filename} exceeds the 20 MB file limit`,
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

interface ValidatedFileMetadata {
  textLength?: number
  pageCount?: number
}

const validateFileContent = async ({
  data,
  filename,
  mimetype,
}: {
  data: Buffer
  filename: string
  mimetype: string
}): Promise<ValidatedFileMetadata> => {
  if (mimetype === "application/pdf") {
    if (!hasPrefix(data, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
      throw new HTTPError(`${filename} is not a valid PDF`, 400)
    }
    const parser = new PDFParse({ data: Uint8Array.from(data) })
    try {
      const info = await parser.getInfo()
      return { pageCount: info.total }
    } finally {
      await parser.destroy()
    }
  }

  try {
    return {
      textLength: new TextDecoder("utf-8", { fatal: true }).decode(data).length,
    }
  } catch {
    throw new HTTPError(`${filename} is not valid UTF-8 text`, 400)
  }
}

export const prepareConversationAttachments = ({
  conversation,
  incoming,
}: {
  conversation: Pick<ChatConversation, "_id" | "attachments">
  incoming: IncomingConversationAttachment[]
}): ChatConversationAttachment[] => {
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
  if (nextCount > MAX_CONVERSATION_ATTACHMENT_COUNT) {
    throw new HTTPError(
      `A conversation can contain at most ${MAX_CONVERSATION_ATTACHMENT_COUNT} files. Use /new to start another conversation.`,
      400
    )
  }
  return deduplicated.map(input => ({
    id: utils.newid(),
    provider: AgentChannelProvider.SLACK,
    providerFileId: input.providerFileId,
    filename: input.filename.trim(),
    mimetype: normalizeMimetype(input.mimetype),
    size: input.size!,
    status: ConversationAttachmentStatus.QUEUED,
    uploadedAt: new Date().toISOString(),
  }))
}

export const persistConversationAttachment = async ({
  conversationId,
  attachment,
  data,
}: {
  conversationId: string
  attachment: ChatConversationAttachment
  data: Buffer
}): Promise<ValidatedFileMetadata> => {
  if (data.byteLength > MAX_CONVERSATION_ATTACHMENT_BYTES) {
    throw new HTTPError(
      `${attachment.filename} exceeds the 20 MB file limit`,
      400
    )
  }
  if (data.byteLength !== attachment.size) {
    throw new HTTPError(
      `${attachment.filename} did not match the size reported by Slack`,
      400
    )
  }
  const metadata = await validateFileContent({
    data,
    filename: attachment.filename,
    mimetype: attachment.mimetype,
  })
  await objectStore.upload({
    bucket: ObjectStoreBuckets.APPS,
    filename: getConversationAttachmentObjectStoreKey({
      workspaceId: context.getOrThrowWorkspaceId(),
      conversationId,
      attachmentId: attachment.id,
    }),
    body: data,
    type: attachment.mimetype,
  })
  return metadata
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

const getSearchResultText = (row: RagSearchResultItem) => {
  if (typeof row.content === "string") {
    return row.content.trim()
  }
  return (row.content || [])
    .map(part =>
      [part.text, part.retrievedContext?.text, part.retrieved_context?.text]
        .find(value => typeof value === "string")
        ?.trim()
    )
    .filter((value): value is string => !!value)
    .join("\n")
}

const getSearchResultContexts = (row: RagSearchResultItem) => [
  row.retrievedContext,
  row.retrieved_context,
  ...(Array.isArray(row.content)
    ? row.content.flatMap(part => [
        part.retrievedContext,
        part.retrieved_context,
      ])
    : []),
]

const getSearchResultSource = (row: RagSearchResultItem) => {
  const candidates = [
    row.file_id,
    row.filename,
    ...getSearchResultContexts(row).flatMap(searchContext => [
      searchContext?.mediaId,
      searchContext?.media_id,
      searchContext?.title,
      searchContext?.uri,
    ]),
    row.id,
  ]
  return candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && !!candidate.trim()
  )
}

const getSearchResultPage = (row: RagSearchResultItem) => {
  const page = getSearchResultContexts(row)
    .map(context => context?.pageNumber ?? context?.page_number)
    .find(value => value != null)
  return page == null ? undefined : String(page)
}

const normalizeFilenameLookup = (value: string) => value.trim().toLowerCase()

const getUnambiguousAttachmentsByFilename = (
  attachments: ChatConversationAttachment[]
) => {
  const attachmentByFilename = new Map<string, ChatConversationAttachment>()
  const ambiguousFilenames = new Set<string>()

  for (const attachment of attachments) {
    if (!attachment.ragSourceId) {
      continue
    }

    const filename = normalizeFilenameLookup(attachment.filename)
    if (!filename || ambiguousFilenames.has(filename)) {
      continue
    }

    const existing = attachmentByFilename.get(filename)
    if (existing && existing.ragSourceId !== attachment.ragSourceId) {
      attachmentByFilename.delete(filename)
      ambiguousFilenames.add(filename)
      continue
    }

    attachmentByFilename.set(filename, attachment)
  }

  return attachmentByFilename
}

export const addConversationAttachmentsToModelMessages = async ({
  messages,
  conversation,
  attachmentIds,
}: {
  messages: ModelMessage[]
  conversation: Pick<
    ChatConversation,
    "_id" | "attachments" | "attachmentVectorStoreId"
  >
  attachmentIds?: string[]
}): Promise<ModelMessage[]> => {
  const conversationId = conversation._id
  if (!conversationId || !conversation.attachmentVectorStoreId) {
    return messages
  }
  const readyAttachments = (conversation.attachments || []).filter(
    attachment => attachment.status === ConversationAttachmentStatus.READY
  )
  const selectedIds = attachmentIds ? new Set(attachmentIds) : undefined
  const attachments = readyAttachments.filter(
    attachment => !selectedIds || selectedIds.has(attachment.id)
  )
  if (!attachments.length) {
    return messages
  }

  const lastUserMessage = messages.findLast(message => message.role === "user")
  if (!lastUserMessage) {
    return messages
  }
  const question =
    typeof lastUserMessage.content === "string"
      ? lastUserMessage.content
      : lastUserMessage.content
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("\n")
  if (!question.trim()) {
    return messages
  }

  const selectedSources = new Map(
    attachments.flatMap(attachment =>
      attachment.ragSourceId
        ? [[attachment.ragSourceId, attachment] as const]
        : []
    )
  )
  const selectedAttachmentIds = new Set(
    attachments.map(attachment => attachment.id)
  )
  const selectedFilenames = new Map(
    [...getUnambiguousAttachmentsByFilename(readyAttachments)].filter(
      ([, attachment]) => selectedAttachmentIds.has(attachment.id)
    )
  )
  const rows = await searchGeminiFileStore({
    vectorStoreId: conversation.attachmentVectorStoreId,
    query: question,
  })
  const maxCharacters =
    MAX_CONVERSATION_ATTACHMENT_CONTEXT_TOKENS * ESTIMATED_CHARACTERS_PER_TOKEN
  let usedCharacters = 0
  let usedChunks = 0
  const contextParts: string[] = []
  for (const row of rows) {
    if (usedChunks >= MAX_CONVERSATION_ATTACHMENT_CONTEXT_CHUNKS) {
      break
    }
    const source = getSearchResultSource(row)
    const attachment = source
      ? selectedSources.get(source) ||
        selectedFilenames.get(normalizeFilenameLookup(source))
      : undefined
    if (!attachment) {
      continue
    }
    const text = getSearchResultText(row)
    if (!text) {
      continue
    }
    const remaining = maxCharacters - usedCharacters
    if (remaining <= 0) {
      break
    }
    const page = getSearchResultPage(row)
    const selectedText = text.slice(0, remaining)
    contextParts.push(
      `<conversation-file name=${JSON.stringify(attachment.filename)}${
        page ? ` page=${JSON.stringify(page)}` : ""
      }>\n${selectedText}\n</conversation-file>`
    )
    usedCharacters += selectedText.length
    usedChunks++
  }
  if (!contextParts.length) {
    return messages
  }

  const content: UserContent = [
    {
      type: "text",
      text: `\n\nRelevant context retrieved from conversation files:\n${contextParts.join(
        "\n\n"
      )}\n\nUse the relevant context above to answer the user's question with a complete response.`,
    },
  ]

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
