import { KnowledgeBaseFileStatus } from "@budibase/types"

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file" | "list"
  children: SharePointEntryTreeNode[]
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}
