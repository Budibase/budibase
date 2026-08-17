import {
  SharePointScopeTargetType,
  type KnowledgeSourceEntry,
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
    }
  }
  if (node.type === "list" && node.listId) {
    return {
      type: SharePointScopeTargetType.LIST,
      listId: node.listId,
    }
  }
  return undefined
}

const getTargetKey = (target: SharePointScopeTarget) => {
  switch (target.type) {
    case SharePointScopeTargetType.DRIVE:
      return `drive:${target.driveId}`
    case SharePointScopeTargetType.FOLDER:
    case SharePointScopeTargetType.FILE:
      return `${target.type}:${target.driveId}:${target.itemId}`
    case SharePointScopeTargetType.LIST:
      return `list:${target.listId}`
  }
}

export const isNodeTargeted = (
  node: SharePointEntryTreeNode,
  targets: SharePointScopeTarget[]
) => {
  const target = nodeToTarget(node)
  return target
    ? targets.some(
        candidate => getTargetKey(candidate) === getTargetKey(target)
      )
    : false
}

export const toggleScopeNode = ({
  targets,
  node,
  nextSelected,
}: {
  targets: SharePointScopeTarget[]
  node: SharePointEntryTreeNode
  nextSelected: boolean
}) => {
  const target = nodeToTarget(node)
  if (!target) {
    return targets
  }
  const targetKey = getTargetKey(target)
  const remainingTargets = targets.filter(
    candidate => getTargetKey(candidate) !== targetKey
  )
  return nextSelected ? [...remainingTargets, target] : remainingTargets
}
