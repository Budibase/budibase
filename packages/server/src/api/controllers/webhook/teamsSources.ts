import { Actions, Card, LinkButton } from "chat"
import type { WebhookChatSourceMetadata } from "@budibase/types"
import sdk from "../../../sdk"
import { toAbsoluteUrl } from "./utils"

const formatTeamsLinkLabel = (value: string) =>
  value
    .replace(/\[|]|<|>|@|\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const getTeamsKnowledgeSourceCard = async ({
  agentId,
  result,
  isPersonalConversation,
}: {
  agentId: string
  result: WebhookChatSourceMetadata
  isPersonalConversation?: boolean
}) => {
  if (
    result.allowKnowledgeSourceDownload === false ||
    !isPersonalConversation
  ) {
    return
  }

  const links: { label: string; url: string }[] = []
  for (const source of result.ragSources || []) {
    if (!source.fileId) {
      continue
    }

    try {
      const signedUrl = await sdk.ai.rag.getFileUrlForAgent(
        agentId,
        source.fileId
      )
      links.push({
        label:
          formatTeamsLinkLabel(source.filename || "") || "Knowledge source",
        url: await toAbsoluteUrl(signedUrl),
      })
    } catch (error) {
      console.error("Failed to generate Teams RAG source link", error)
    }
  }
  if (!links.length) {
    return
  }

  return Card({
    title: "Sources",
    children: [Actions(links.map(source => LinkButton(source)))],
  })
}
