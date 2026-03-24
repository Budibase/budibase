import { HTTPError } from "@budibase/backend-core"
import type { ChatConversation, ChatConversationRequest } from "@budibase/types"
import {
  convertToModelMessages,
  isTextUIPart,
  type ModelMessage,
  pruneMessages,
} from "ai"
import { truncateToolPartsForSave } from "./messages"

interface PrepareChatConversationForSaveParams {
  chatId: string
  chatAppId: string
  userId: string
  title?: string
  messages: ChatConversation["messages"]
  chat: Partial<ChatConversationRequest>
  existingChat?: ChatConversation | null
}

export const prepareChatConversationForSave = ({
  chatId,
  chatAppId,
  userId,
  title,
  messages,
  chat,
  existingChat,
}: PrepareChatConversationForSaveParams): ChatConversation => {
  const now = new Date().toISOString()
  const createdAt = existingChat?.createdAt || chat.createdAt || now
  const updatedAt = now
  const rev = existingChat?._rev || chat._rev
  const agentId = existingChat?.agentId || chat.agentId
  const channel = chat.channel || existingChat?.channel

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  return {
    _id: chatId,
    ...(rev && { _rev: rev }),
    chatAppId,
    agentId,
    userId,
    title: title ?? chat.title,
    messages: truncateToolPartsForSave(messages),
    updatedAt,
    ...(createdAt && { createdAt }),
    ...(channel && { channel }),
  }
}

export const extractUserText = (
  message?: ChatConversation["messages"][number]
) => {
  if (!message || !Array.isArray(message.parts)) {
    return ""
  }

  return message.parts
    .filter(isTextUIPart)
    .map(part => part.text)
    .join("")
    .trim()
}

export const findLatestUserQuestion = (
  chat: Pick<ChatConversationRequest, "messages">
) => {
  const messages = chat.messages || []

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const current = messages[i]
    if (current?.role !== "user") {
      continue
    }

    const text = extractUserText(current)
    if (text) {
      return text
    }
  }

  return ""
}

export const truncateTitle = (value: string, maxLength = 120) => {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) {
    return trimmed
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`
}

export const prepareModelMessages = async (
  messages: ChatConversationRequest["messages"]
): Promise<ModelMessage[]> => {
  const modelMessages = await convertToModelMessages(messages)

  return pruneMessages({
    messages: modelMessages,
    reasoning: "all",
    toolCalls: "before-last-2-messages",
    emptyMessages: "remove",
  })
}

export const addRetrievedContextToMessages = (
  messages: ModelMessage[],
  retrievedContext: string
): ModelMessage[] => {
  if (!retrievedContext) {
    return messages
  }

  return [
    {
      role: "system",
      content: `Relevant knowledge:\n${retrievedContext}\n\nUse this content when answering the user.`,
    },
    ...messages,
  ]
}
