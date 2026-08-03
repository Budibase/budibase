import type { KnowledgeBaseFileStatus } from "@budibase/types"
import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"

export interface TreeEntryInput {
  filename: string
  sourcePath?: string
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}

const getFilePath = (file: Pick<TreeEntryInput, "sourcePath" | "filename">) =>
  (file.sourcePath || file.filename).trim()

export const buildEntryTree = (
  files: TreeEntryInput[]
): SharePointEntryTreeNode[] => {
  const fileNodesByPath = new Map<
    string,
    { path: string; status?: KnowledgeBaseFileStatus; errorMessage?: string }
  >()

  for (const file of files) {
    const path = getFilePath(file)
    if (!path) {
      continue
    }
    fileNodesByPath.set(path, {
      path,
      status: file.status,
      errorMessage: file.errorMessage,
    })
  }

  const roots: SharePointEntryTreeNode[] = []
  const byPath = new Map<string, SharePointEntryTreeNode>()

  for (const fileNode of [...fileNodesByPath.values()].sort((a, b) =>
    a.path.localeCompare(b.path)
  )) {
    const parts = fileNode.path.split("/").filter(Boolean)
    let parent = roots
    let currentPath = ""

    for (let index = 0; index < parts.length; index++) {
      const segment = parts[index]
      currentPath = currentPath ? `${currentPath}/${segment}` : segment
      const isLeaf = index === parts.length - 1
      let node = byPath.get(currentPath)
      if (!node) {
        node = {
          id: currentPath,
          name: segment,
          path: currentPath,
          type: isLeaf ? "file" : "folder",
          children: [],
        }
        byPath.set(currentPath, node)
        parent.push(node)
      }
      if (isLeaf) {
        node.type = "file"
        node.status = fileNode.status
        node.errorMessage = fileNode.errorMessage
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
