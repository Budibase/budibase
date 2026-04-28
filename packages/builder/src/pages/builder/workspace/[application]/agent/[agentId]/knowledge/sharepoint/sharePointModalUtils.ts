import {
  type KnowledgeBaseFileStatus,
  type KnowledgeSourceEntry,
} from "@budibase/types"
import {
  EXCLUDE_ALL_PATTERN,
  matchesConfiguredPatterns,
} from "@budibase/shared-core"
import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"

export interface TreeEntryInput {
  filename: string
  sourcePath?: string
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}

export const SITE_ROOT_PATH = "__site_root__"
export { EXCLUDE_ALL_PATTERN, matchesConfiguredPatterns }

const getFilePath = (file: Pick<TreeEntryInput, "sourcePath" | "filename">) =>
  (file.sourcePath || file.filename).trim()

const toSelectionPattern = (
  path: string,
  selectionNodeByPath: Map<string, SharePointEntryTreeNode>,
  negated: boolean
) => {
  const node = selectionNodeByPath.get(path)
  const basePattern = node?.type === "file" ? path : `${path}/**`
  return negated ? `!${basePattern}` : basePattern
}

export const isExcludeNewByDefaultPatterns = (patterns: string[]) => {
  const firstPattern = patterns.find(pattern => pattern.trim().length > 0)
  return firstPattern?.trim() === EXCLUDE_ALL_PATTERN
}

export const rehydrateFromPatterns = (
  patterns: string[],
  selectablePaths: string[],
  currentSelection: string[] = []
) => {
  const selectableWithoutRoot = selectablePaths.filter(
    path => path !== SITE_ROOT_PATH
  )

  if (!patterns.length) {
    return [...selectablePaths]
  }

  const includedPaths = selectableWithoutRoot.filter(path =>
    matchesConfiguredPatterns(path, patterns)
  )

  if (selectableWithoutRoot.length === 0) {
    return currentSelection.filter(path => path === SITE_ROOT_PATH)
  }

  if (includedPaths.length === selectableWithoutRoot.length) {
    return [SITE_ROOT_PATH, ...includedPaths]
  }

  return includedPaths
}
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
    const path = fileNode.path
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
          status: isLeaf ? fileNode.status : undefined,
          errorMessage: isLeaf ? fileNode.errorMessage : undefined,
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

export const buildEntryTreeFromSourceEntries = (
  entries: KnowledgeSourceEntry[]
): SharePointEntryTreeNode[] => {
  const roots: SharePointEntryTreeNode[] = []
  const byPath = new Map<string, SharePointEntryTreeNode>()

  for (const entry of entries) {
    const path = entry.path.trim()
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
      const shouldBeFile = isLeaf && entry.type === "file"

      let node = byPath.get(currentPath)
      if (!node) {
        node = {
          id: currentPath,
          name: segment,
          path: currentPath,
          type: shouldBeFile ? "file" : "folder",
          children: [],
        }
        byPath.set(currentPath, node)
        parent.push(node)
      } else if (shouldBeFile) {
        node.type = "file"
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

export const wrapSelectionTreeWithSiteRoot = (
  nodes: SharePointEntryTreeNode[]
): SharePointEntryTreeNode[] => {
  if (nodes.length === 0) {
    return []
  }
  return [
    {
      id: SITE_ROOT_PATH,
      name: "Site root",
      path: SITE_ROOT_PATH,
      type: "folder",
      children: nodes,
    },
  ]
}

export const collectSelectablePaths = (
  nodes: SharePointEntryTreeNode[]
): string[] => {
  const paths: string[] = []
  for (const node of nodes) {
    if (node.type === "folder" || node.type === "file") {
      paths.push(node.path)
    }
    paths.push(...collectSelectablePaths(node.children))
  }
  return paths
}

export const flattenNodesByPath = (
  nodes: SharePointEntryTreeNode[]
): Map<string, SharePointEntryTreeNode> => {
  const byPath = new Map<string, SharePointEntryTreeNode>()
  const visit = (node: SharePointEntryTreeNode) => {
    byPath.set(node.path, node)
    for (const child of node.children) {
      visit(child)
    }
  }
  for (const node of nodes) {
    visit(node)
  }
  return byPath
}

export const buildFileDescendantPathsByNodePath = (
  nodes: SharePointEntryTreeNode[]
): Map<string, string[]> => {
  const byPath = new Map<string, string[]>()

  const collect = (node: SharePointEntryTreeNode): string[] => {
    if (node.type === "file") {
      const ownPath = [node.path]
      byPath.set(node.path, ownPath)
      return ownPath
    }

    const descendantFilePaths = node.children.flatMap(child => collect(child))
    byPath.set(node.path, descendantFilePaths)
    return descendantFilePaths
  }

  for (const node of nodes) {
    collect(node)
  }

  return byPath
}

export const buildPatternsFromSelection = (
  selectedEntryPaths: string[],
  selectablePaths: string[],
  selectionNodeByPath: Map<string, SharePointEntryTreeNode>,
  includeNewFilesByDefault: boolean
): { patterns?: string[] } => {
  const selectedWithoutRoot = selectedEntryPaths.filter(
    path => path !== SITE_ROOT_PATH
  )
  const selectedPathSet = new Set(selectedWithoutRoot)
  const selectableWithoutRoot = selectablePaths.filter(
    path => path !== SITE_ROOT_PATH
  )
  const hasSelectedSiteRoot = selectedEntryPaths.includes(SITE_ROOT_PATH)
  const isEffectivelySelectAll =
    hasSelectedSiteRoot &&
    selectableWithoutRoot.length > 0 &&
    selectedWithoutRoot.length === selectableWithoutRoot.length

  if (includeNewFilesByDefault && isEffectivelySelectAll) {
    return {}
  }

  if (includeNewFilesByDefault) {
    const patterns = selectableWithoutRoot
      .filter(path => !selectedPathSet.has(path))
      .map(path => toSelectionPattern(path, selectionNodeByPath, true))
    return patterns.length > 0 ? { patterns } : {}
  }

  const patterns = [
    EXCLUDE_ALL_PATTERN,
    ...selectedWithoutRoot.map(path =>
      toSelectionPattern(path, selectionNodeByPath, false)
    ),
  ]
  return { patterns }
}
