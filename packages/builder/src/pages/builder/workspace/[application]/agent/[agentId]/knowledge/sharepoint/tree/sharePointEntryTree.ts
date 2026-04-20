import type { SharePointDisplayStatus } from "./sharepoint/sharePointStatus"

export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file"
  children: SharePointEntryTreeNode[]
  status?: SharePointDisplayStatus
  errorMessage?: string
}
