import {
  AgentKnowledgeSourceSyncEntryStatus,
  KnowledgeBaseFileStatus,
  type AgentKnowledgeSourceSyncEntry,
  type KnowledgeSourceEntry,
} from "@budibase/types"
import type {
  SharePointEntryTreeNode,
  SharePointStatus,
} from "./tree/sharePointEntryTree"

export interface TreeEntryInput {
  filename: string
  sourcePath?: string
  status?: KnowledgeBaseFileStatus
  errorMessage?: string
}

export const SITE_ROOT_PATH = "__site_root__"
export const EXCLUDE_ALL_PATTERN = "!*"

const getFilePath = (file: Pick<TreeEntryInput, "sourcePath" | "filename">) =>
  (file.sourcePath || file.filename).trim()

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const globToRegExp = (pattern: string): RegExp => {
  let regex = "^"
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i]
    if (char === "*") {
      if (pattern[i + 1] === "*") {
        regex += ".*"
        i += 1
      } else {
        regex += "[^/]*"
      }
    } else if (char === "?") {
      regex += "[^/]"
    } else {
      regex += escapeRegExp(char)
    }
  }
  regex += "$"
  return new RegExp(regex)
}

export const normalizePath = (value: string) =>
  value
    .replace(/^\/+/, "")
    .replace(/\\/g, "/")
    .replace(/\/{2,}/g, "/")
    .trim()
    .toLowerCase()

export const matchesConfiguredPatterns = (path: string, patterns: string[]) => {
  if (!patterns.length) {
    return true
  }
  const hasPositivePattern = patterns.some(pattern => !pattern.startsWith("!"))
  const normalizedPath = normalizePath(path)
  let included = !hasPositivePattern

  for (const rawPattern of patterns) {
    const isNegated = rawPattern.startsWith("!")
    const body = (isNegated ? rawPattern.slice(1) : rawPattern).trim()
    if (!body) {
      continue
    }
    const normalizedPattern = normalizePath(body)
    if (!normalizedPattern) {
      continue
    }
    if (globToRegExp(normalizedPattern).test(normalizedPath)) {
      included = !isNegated
    }
  }

  return included
}

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
  files: TreeEntryInput[],
  syncEntries: AgentKnowledgeSourceSyncEntry[] = []
): SharePointEntryTreeNode[] => {
  const fileNodesByPath = new Map<
    string,
    { path: string; status?: SharePointStatus; errorMessage?: string }
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

  for (const entry of syncEntries) {
    const path = (entry.path || "").trim()
    if (!path) {
      continue
    }
    const existing = fileNodesByPath.get(path)
    const syncStatus = entry.status
    if (!existing) {
      if (syncStatus === AgentKnowledgeSourceSyncEntryStatus.FAILED) {
        fileNodesByPath.set(path, {
          path,
          status: syncStatus,
          errorMessage: entry.errorMessage,
        })
      }
      continue
    }
    if (!existing.errorMessage && entry.errorMessage) {
      existing.errorMessage = entry.errorMessage
    }
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
      } else if (isLeaf) {
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
    const normalizedPath = normalizePath(entry.path)
    if (!normalizedPath) {
      continue
    }

    const parts = normalizedPath.split("/").filter(Boolean)
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

export const filterTreeByPatterns = (
  nodes: SharePointEntryTreeNode[],
  patterns: string[]
): SharePointEntryTreeNode[] => {
  const nextNodes: SharePointEntryTreeNode[] = []
  for (const node of nodes) {
    if (node.type === "file") {
      if (matchesConfiguredPatterns(node.path, patterns)) {
        nextNodes.push(node)
      }
      continue
    }

    const children = filterTreeByPatterns(node.children, patterns)
    if (children.length > 0) {
      nextNodes.push({
        ...node,
        children,
      })
    }
  }
  return nextNodes
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
