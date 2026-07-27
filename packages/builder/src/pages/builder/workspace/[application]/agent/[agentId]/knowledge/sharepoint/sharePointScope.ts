import {
  SharePointScopeAction,
  SharePointScopeTargetType,
  type KnowledgeSourceEntry,
  type SharePointScopeRule,
  type SharePointScopeTarget,
} from "@budibase/types"
import type { SharePointEntryTreeNode } from "./tree/sharePointEntryTree"

export const entryToNode = (
  entry: KnowledgeSourceEntry
): SharePointEntryTreeNode => ({
  id: entry.id,
  name: entry.name,
  path: entry.path,
  type: entry.type,
  driveId: entry.driveId,
  itemId: entry.itemId,
  listId: entry.listId,
  hasChildren: entry.hasChildren,
  childrenLoaded: !entry.hasChildren,
  children: [],
})

export const nodeToTarget = (
  node: SharePointEntryTreeNode
): SharePointScopeTarget | undefined => {
  if (node.type === "drive" && node.driveId) {
    return {
      type: SharePointScopeTargetType.DRIVE,
      driveId: node.driveId,
      name: node.name,
    }
  }
  if (
    (node.type === "folder" || node.type === "file") &&
    node.driveId &&
    node.itemId
  ) {
    return {
      type:
        node.type === "folder"
          ? SharePointScopeTargetType.FOLDER
          : SharePointScopeTargetType.FILE,
      driveId: node.driveId,
      itemId: node.itemId,
      name: node.name,
      path: node.path,
    }
  }
  if (node.type === "list" && node.listId) {
    return {
      type: SharePointScopeTargetType.LIST,
      listId: node.listId,
      name: node.name,
    }
  }
  return undefined
}

const isTargetWithinNode = (
  target: SharePointScopeTarget,
  node: SharePointEntryTreeNode
) => {
  if (node.type === "list") {
    return (
      target.type === SharePointScopeTargetType.LIST &&
      target.listId === node.listId
    )
  }
  if (node.type === "drive") {
    return "driveId" in target && target.driveId === node.driveId
  }
  if (node.type === "file") {
    return (
      target.type === SharePointScopeTargetType.FILE &&
      target.driveId === node.driveId &&
      target.itemId === node.itemId
    )
  }
  return (
    (target.type === SharePointScopeTargetType.FOLDER ||
      target.type === SharePointScopeTargetType.FILE) &&
    target.driveId === node.driveId &&
    (target.itemId === node.itemId || target.path.startsWith(`${node.path}/`))
  )
}

export const toggleScopeNode = ({
  rules,
  node,
  nextSelected,
  inheritedAction,
}: {
  rules: SharePointScopeRule[]
  node: SharePointEntryTreeNode
  nextSelected: boolean
  inheritedAction: SharePointScopeAction
}) => {
  const target = nodeToTarget(node)
  if (!target) {
    return rules
  }
  const nextAction = nextSelected
    ? SharePointScopeAction.INCLUDE
    : SharePointScopeAction.EXCLUDE
  const remainingRules = rules.filter(
    rule => !isTargetWithinNode(rule.target, node)
  )
  return nextAction === inheritedAction
    ? remainingRules
    : [...remainingRules, { action: nextAction, target }]
}
