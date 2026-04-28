import { KnowledgeBaseFileStatus } from "@budibase/types"

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file"
  children: SharePointEntryTreeNode[]
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}
