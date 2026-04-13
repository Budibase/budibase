export interface SharePointEntryTreeNode {
  id: string
  name: string
  path: string
  type: "folder" | "file"
  children: SharePointEntryTreeNode[]
}
