import { type KnowledgeBaseFileStatus } from "@budibase/types"
import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"

export interface TreeEntryInput {
  filename: string
  sourcePath?: string
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}

export const buildEntryTree = (
  files: TreeEntryInput[]
): SharePointEntryTreeNode[] => {
  const roots: SharePointEntryTreeNode[] = []
  const byPath = new Map<string, SharePointEntryTreeNode>()

  for (const file of files) {
    const path = file.sourcePath || file.filename
    if (!path) {
      continue
    }

    const parts = path.split("/").filter(Boolean)
    let parent = roots
    let currentPath = ""

    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i]
      currentPath = currentPath ? `${currentPath}/${segment}` : segment
      const isLeaf = i === parts.length - 1

      let node = byPath.get(currentPath)
      if (!node) {
        node = {
          id: currentPath,
          name: segment,
          path: currentPath,
          type: isLeaf ? "file" : "folder",
          status: isLeaf ? file.status : undefined,
          errorMessage: isLeaf ? file.errorMessage : undefined,
          children: [],
        }
        byPath.set(currentPath, node)
        parent.push(node)
      } else if (isLeaf) {
        node.type = "file"
        node.status = file.status
        node.errorMessage = file.errorMessage
      }

      parent = node.children
    }
  }

  const sortNodes = (nodes: SharePointEntryTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    for (const node of nodes) {
      sortNodes(node.children)
    }
  }

  sortNodes(roots)
  return roots
}
