import fetch, { FetchError } from "node-fetch"
import { encryption, HTTPError } from "@budibase/backend-core"
import type {
  ChatConversationAttachment,
  MSTeamsActivity,
} from "@budibase/types"
import {
  getConversationAttachmentMimetype,
  MAX_CONVERSATION_ATTACHMENT_BYTES,
} from "../../../sdk/workspace/ai/chatConversations/attachments"

export const getTeamsAttachments = (activity?: MSTeamsActivity) => {
  if (activity?.conversation?.conversationType !== "personal") {
    return []
  }
  return (activity.attachments || [])
    .filter(
      file =>
        file.contentType ===
        "application/vnd.microsoft.teams.file.download.info"
    )
    .map(file => ({
      providerFileId: file.content?.uniqueId || "",
      filename: file.name || "",
      mimetype: getConversationAttachmentMimetype(file.name || ""),
      downloadUrl: file.content?.downloadUrl,
    }))
}

export const getTeamsFileData = async (
  attachment: ChatConversationAttachment
) => {
  if (!attachment.encryptedDownloadUrl) {
    throw new HTTPError("Teams file download URL is missing", 400)
  }
  const url = new URL(encryption.decrypt(attachment.encryptedDownloadUrl))
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".sharepoint.com") ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443")
  ) {
    throw new HTTPError("Invalid Teams file download URL", 400)
  }
  try {
    const response = await fetch(url, {
      redirect: "error",
      timeout: 30_000,
      size: MAX_CONVERSATION_ATTACHMENT_BYTES,
    })
    if (!response.ok) {
      throw new HTTPError("Failed to download Teams file", response.status)
    }
    const data = await response.buffer()
    if (!data.length) {
      throw new HTTPError(`${attachment.filename} is empty`, 400)
    }
    return data
  } catch (error) {
    if (error instanceof FetchError && error.type === "max-size") {
      throw new HTTPError(
        `${attachment.filename} exceeds the 20 MB file limit`,
        400
      )
    }
    if (error instanceof FetchError) {
      throw new Error("Failed to download Teams file")
    }
    throw error
  }
}
