import {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
} from "@budibase/types"

export type SharePointDisplayStatus =
  | "processing"
  | "ready"
  | "failed"
  | "excluded"
  | "unsupported"

export const toSharePointDisplayStatusFromFile = (
  status: KnowledgeBaseFileStatus
): SharePointDisplayStatus => {
  switch (status) {
    case KnowledgeBaseFileStatus.PROCESSING:
      return "processing"
    case KnowledgeBaseFileStatus.READY:
      return "ready"
    case KnowledgeBaseFileStatus.FAILED:
      return "failed"
  }
}

export const toSharePointDisplayStatusFromSyncEntry = (
  status: AgentKnowledgeSourceSyncEntryStatus
): SharePointDisplayStatus => {
  switch (status) {
    case AgentKnowledgeSourceSyncEntryStatus.SYNCED:
      return "ready"
    case AgentKnowledgeSourceSyncEntryStatus.FAILED:
      return "failed"
    case AgentKnowledgeSourceSyncEntryStatus.EXCLUDED:
      return "excluded"
    case AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED:
      return "unsupported"
  }
}

export const getSharePointStatusText = (status?: SharePointDisplayStatus) => {
  switch (status) {
    case "processing":
      return "Processing"
    case "ready":
      return "Ready"
    case "failed":
      return "Failed"
    case "excluded":
      return "Excluded"
    case "unsupported":
      return "Not supported"
    default:
      return undefined
  }
}

export const getSharePointStatusLightProps = (
  status?: SharePointDisplayStatus
) => {
  switch (status) {
    case "ready":
      return { positive: true }
    case "failed":
    case "unsupported":
      return { negative: true }
    default:
      return { notice: true }
  }
}

export const isSelectableSharePointStatus = (
  status?: SharePointDisplayStatus
) => status !== "unsupported"
