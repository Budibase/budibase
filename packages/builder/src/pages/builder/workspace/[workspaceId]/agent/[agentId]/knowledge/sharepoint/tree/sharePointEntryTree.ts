import { KnowledgeBaseFileStatus } from "@budibase/types"

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "drive" | "folder" | "file" | "list"
  driveId?: string
  itemId?: string
  listId?: string
  hasChildren?: boolean
  childrenLoaded?: boolean
  loading?: boolean
  loadError?: string
  open?: boolean
  children: SharePointEntryTreeNode[]
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}
