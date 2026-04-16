import type {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
} from "@budibase/types"

export type SharePointEntryNodeStatus =
  | AgentKnowledgeSourceSyncEntryStatus
  | KnowledgeBaseFileStatus

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file"
  children: SharePointEntryTreeNode[]
  status?: SharePointEntryNodeStatus
}
