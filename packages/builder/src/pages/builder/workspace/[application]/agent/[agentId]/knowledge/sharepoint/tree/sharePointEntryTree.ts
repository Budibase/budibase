import {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
} from "@budibase/types"

export type SharePointStatus =
  | KnowledgeBaseFileStatus
  | AgentKnowledgeSourceSyncEntryStatus

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file"
  children: SharePointEntryTreeNode[]
  status?: SharePointStatus
  errorMessage?: string
}
