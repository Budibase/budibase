import {
  KnowledgeBaseFileStatus,
  type AgentKnowledgeSourceSyncEntry,
  type KnowledgeSourceEntry,
} from "@budibase/types"
import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"
import {
  isSelectableSharePointStatus,
  toSharePointDisplayStatusFromFile,
  toSharePointDisplayStatusFromSyncEntry,
  type SharePointDisplayStatus,
} from "./sharePointStatus"

export interface TreeEntryInput {
  filename: string
  sourcePath?: string
  status: KnowledgeBaseFileStatus
  errorMessage?: string
}

export const SITE_ROOT_PATH = "__site_root__"

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

const toPatternFolderPath = (rawPattern: string) => {
  if (!rawPattern || rawPattern.startsWith("!")) {
    return undefined
  }
  const pattern = rawPattern.trim()
  if (!pattern) {
    return undefined
  }
  return pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern
}

export const rehydrateFromPatterns = (
  patterns: string[],
  selectablePaths: string[],
  currentSelection: string[] = []
) => {
  const pathSet = new Set(selectablePaths)
  const nextSelection = new Set<string>()

  for (const rawPattern of patterns) {
    const normalizedPattern = toPatternFolderPath(rawPattern)
    if (!normalizedPattern) {
      continue
    }
    if (pathSet.has(normalizedPattern)) {
      nextSelection.add(normalizedPattern)
      continue
    }

    const parentMatch = selectablePaths
      .filter(path => normalizedPattern.startsWith(`${path}/`))
      .sort((a, b) => b.length - a.length)[0]
    if (parentMatch) {
      nextSelection.add(parentMatch)
    }
  }

  if (nextSelection.size > 0) {
    return Array.from(nextSelection)
  }

  if (selectablePaths.length === 0) {
    return patterns.map(toPatternFolderPath).filter(Boolean) as string[]
  }

  return currentSelection
    .filter(path => pathSet.has(path))
    .sort((a, b) => a.localeCompare(b))
}

export const buildEntryTree = (
  files: TreeEntryInput[],
  syncEntries: AgentKnowledgeSourceSyncEntry[] = []
): SharePointEntryTreeNode[] => {
  const fileNodesByPath = new Map<
    string,
    { path: string; status: SharePointDisplayStatus; errorMessage?: string }
  >()

  for (const file of files) {
    const path = getFilePath(file)
    if (!path) {
      continue
    }
    fileNodesByPath.set(path, {
      path,
      status: toSharePointDisplayStatusFromFile(file.status),
      errorMessage: file.errorMessage,
    })
  }

  for (const entry of syncEntries) {
    const path = (entry.path || "").trim()
    if (!path) {
      continue
    }
    const existing = fileNodesByPath.get(path)
    const displayStatus = toSharePointDisplayStatusFromSyncEntry(entry.status)
    if (!existing) {
      if (displayStatus === "failed") {
        fileNodesByPath.set(path, {
          path,
          status: displayStatus,
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
): SharePointEntryTreeNode[] =>
  buildEntryTree(
    entries.map(entry => ({
      filename: entry.name,
      sourcePath: entry.path,
      status: KnowledgeBaseFileStatus.READY,
    }))
  )

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
    if (
      node.type === "folder" ||
      (node.type === "file" && isSelectableSharePointStatus(node.status))
    ) {
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
  selectionNodeByPath: Map<string, SharePointEntryTreeNode>
): { patterns?: string[] } => {
  const selectedWithoutRoot = selectedEntryPaths.filter(
    path => path !== SITE_ROOT_PATH
  )
  const selectableWithoutRoot = selectablePaths.filter(
    path => path !== SITE_ROOT_PATH
  )
  const hasSelectedSiteRoot = selectedEntryPaths.includes(SITE_ROOT_PATH)
  const isEffectivelySelectAll =
    hasSelectedSiteRoot &&
    selectableWithoutRoot.length > 0 &&
    selectedWithoutRoot.length === selectableWithoutRoot.length

  if (isEffectivelySelectAll) {
    return {}
  }

  const patterns = selectedWithoutRoot.map(path => {
    const node = selectionNodeByPath.get(path)
    if (node?.type === "file") {
      return path
    }
    return `${path}/**`
  })
  return patterns.length > 0 ? { patterns } : {}
}
