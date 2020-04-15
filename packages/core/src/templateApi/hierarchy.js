import {
  find,
  constant,
  map,
  last,
  first,
  split,
  intersection,
  take,
  union,
  includes,
  filter,
  some,
} from "lodash/fp"
import {
  $,
  switchCase,
  isNothing,
  isSomething,
  defaultCase,
  splitKey,
  isNonEmptyString,
  joinKey,
  getHashCode,
} from "../common"
import { indexTypes } from "./indexes"

export const getFlattenedHierarchy = (appHierarchy, useCached = true) => {
  if (isSomething(appHierarchy.getFlattenedHierarchy) && useCached) {
    return appHierarchy.getFlattenedHierarchy()
  }

  const flattenHierarchy = (currentNode, flattened) => {
    flattened.push(currentNode)
    if (
      (!currentNode.children || currentNode.children.length === 0) &&
      (!currentNode.indexes || currentNode.indexes.length === 0) &&
      (!currentNode.aggregateGroups || currentNode.aggregateGroups.length === 0)
    ) {
      return flattened
    }

    const unionIfAny = l2 => l1 => union(l1)(!l2 ? [] : l2)

    const children = $(
      [],
      [
        unionIfAny(currentNode.children),
        unionIfAny(currentNode.indexes),
        unionIfAny(currentNode.aggregateGroups),
      ]
    )

    for (const child of children) {
      flattenHierarchy(child, flattened)
    }
    return flattened
  }

  appHierarchy.getFlattenedHierarchy = () => flattenHierarchy(appHierarchy, [])
  return appHierarchy.getFlattenedHierarchy()
}

export const getLastPartInKey = key => last(splitKey(key))

export const getNodesInPath = appHierarchy => key =>
  $(appHierarchy, [
    getFlattenedHierarchy,
    filter(n => new RegExp(`${n.pathRegx()}`).test(key)),
  ])

export const getExactNodeForKey = appHierarchy => key =>
  $(appHierarchy, [
    getFlattenedHierarchy,
    find(n => new RegExp(`${n.pathRegx()}$`).test(key)),
  ])

export const getNodeForCollectionPath = appHierarchy => collectionKey =>
  $(appHierarchy, [
    getFlattenedHierarchy,
    find(
      n =>
        isCollectionRecord(n) &&
        new RegExp(`${n.collectionPathRegx()}$`).test(collectionKey)
    ),
  ])

export const hasMatchingAncestor = ancestorPredicate => decendantNode =>
  switchCase(
    [node => isNothing(node.parent()), constant(false)],

    [node => ancestorPredicate(node.parent()), constant(true)],

    [defaultCase, node => hasMatchingAncestor(ancestorPredicate)(node.parent())]
  )(decendantNode)

export const getNode = (appHierarchy, nodeKey) =>
  $(appHierarchy, [
    getFlattenedHierarchy,
    find(
      n =>
        n.nodeKey() === nodeKey ||
        (isCollectionRecord(n) && n.collectionNodeKey() === nodeKey)
    ),
  ])

export const getCollectionNode = (appHierarchy, nodeKey) =>
  $(appHierarchy, [
    getFlattenedHierarchy,
    find(n => isCollectionRecord(n) && n.collectionNodeKey() === nodeKey),
  ])

export const getNodeByKeyOrNodeKey = (appHierarchy, keyOrNodeKey) => {
  const nodeByKey = getExactNodeForKey(appHierarchy)(keyOrNodeKey)
  return isNothing(nodeByKey) ? getNode(appHierarchy, keyOrNodeKey) : nodeByKey
}

export const getCollectionNodeByKeyOrNodeKey = (appHierarchy, keyOrNodeKey) => {
  const nodeByKey = getNodeForCollectionPath(appHierarchy)(keyOrNodeKey)
  return isNothing(nodeByKey)
    ? getCollectionNode(appHierarchy, keyOrNodeKey)
    : nodeByKey
}

export const isNode = (appHierarchy, key) =>
  isSomething(getExactNodeForKey(appHierarchy)(key))

export const getActualKeyOfParent = (parentNodeKey, actualChildKey) =>
  $(actualChildKey, [
    splitKey,
    take(splitKey(parentNodeKey).length),
    ks => joinKey(...ks),
  ])

export const getParentKey = key => {
  return $(key, [splitKey, take(splitKey(key).length - 1), joinKey])
}

export const isKeyAncestorOf = ancestorKey => decendantNode =>
  hasMatchingAncestor(p => p.nodeKey() === ancestorKey)(decendantNode)

export const hasNoMatchingAncestors = parentPredicate => node =>
  !hasMatchingAncestor(parentPredicate)(node)

export const findField = (recordNode, fieldName) =>
  find(f => f.name == fieldName)(recordNode.fields)

export const isAncestor = decendant => ancestor =>
  isKeyAncestorOf(ancestor.nodeKey())(decendant)

export const isDecendant = ancestor => decendant =>
  isAncestor(decendant)(ancestor)

export const getRecordNodeId = recordKey =>
  $(recordKey, [splitKey, last, getRecordNodeIdFromId])

export const getRecordNodeIdFromId = recordId =>
  $(recordId, [split("-"), first, parseInt])

export const getRecordNodeById = (hierarchy, recordId) =>
  $(hierarchy, [
    getFlattenedHierarchy,
    find(n => isModel(n) && n.nodeId === getRecordNodeIdFromId(recordId)),
  ])

export const recordNodeIdIsAllowed = indexNode => nodeId =>
  indexNode.allowedModelNodeIds.length === 0 ||
  includes(nodeId)(indexNode.allowedModelNodeIds)

export const recordNodeIsAllowed = indexNode => recordNode =>
  recordNodeIdIsAllowed(indexNode)(recordNode.nodeId)

export const getAllowedRecordNodesForIndex = (appHierarchy, indexNode) => {
  const recordNodes = $(appHierarchy, [getFlattenedHierarchy, filter(isModel)])

  if (isGlobalIndex(indexNode)) {
    return $(recordNodes, [filter(recordNodeIsAllowed(indexNode))])
  }

  if (isAncestorIndex(indexNode)) {
    return $(recordNodes, [
      filter(isDecendant(indexNode.parent())),
      filter(recordNodeIsAllowed(indexNode)),
    ])
  }

  if (isReferenceIndex(indexNode)) {
    return $(recordNodes, [
      filter(n => some(fieldReversesReferenceToIndex(indexNode))(n.fields)),
    ])
  }
}

export const getDependantIndexes = (hierarchy, recordNode) => {
  const allIndexes = $(hierarchy, [getFlattenedHierarchy, filter(isIndex)])

  const allowedAncestors = $(allIndexes, [
    filter(isAncestorIndex),
    filter(i => recordNodeIsAllowed(i)(recordNode)),
  ])

  const allowedReference = $(allIndexes, [
    filter(isReferenceIndex),
    filter(i => some(fieldReversesReferenceToIndex(i))(recordNode.fields)),
  ])

  return [...allowedAncestors, ...allowedReference]
}

export const getNodeFromNodeKeyHash = hierarchy => hash =>
  $(hierarchy, [
    getFlattenedHierarchy,
    find(n => getHashCode(n.nodeKey()) === hash),
  ])

export const isModel = node => isSomething(node) && node.type === "record"
export const isSingleRecord = node => isModel(node) && node.isSingle
export const isCollectionRecord = node => isModel(node) && !node.isSingle
export const isIndex = node => isSomething(node) && node.type === "index"
export const isaggregateGroup = node =>
  isSomething(node) && node.type === "aggregateGroup"
export const isShardedIndex = node =>
  isIndex(node) && isNonEmptyString(node.getShardName)
export const isRoot = node => isSomething(node) && node.isRoot()
export const findRoot = node => (isRoot(node) ? node : findRoot(node.parent()))
export const isDecendantOfARecord = hasMatchingAncestor(isModel)
export const isGlobalIndex = node => isIndex(node) && isRoot(node.parent())
export const isReferenceIndex = node =>
  isIndex(node) && node.indexType === indexTypes.reference
export const isAncestorIndex = node =>
  isIndex(node) && node.indexType === indexTypes.ancestor
export const isTopLevelRecord = node => isRoot(node.parent()) && isModel(node)
export const isTopLevelIndex = node => isRoot(node.parent()) && isIndex(node)
export const getCollectionKey = recordKey =>
  $(recordKey, [splitKey, parts => joinKey(parts.slice(0, parts.length - 1))])
export const fieldReversesReferenceToNode = node => field =>
  field.type === "reference" &&
  intersection(field.typeOptions.reverseIndexNodeKeys)(
    map(i => i.nodeKey())(node.indexes)
  ).length > 0

export const fieldReversesReferenceToIndex = indexNode => field =>
  field.type === "reference" &&
  intersection(field.typeOptions.reverseIndexNodeKeys)([indexNode.nodeKey()])
    .length > 0

export const nodeNameFromNodeKey = (hierarchy, nodeKey) => {
  const node = getNode(hierarchy, nodeKey)
  return node ? node.nodeName() : ""
}

export default {
  getLastPartInKey,
  getNodesInPath,
  getExactNodeForKey,
  hasMatchingAncestor,
  getNode,
  getNodeByKeyOrNodeKey,
  isNode,
  getActualKeyOfParent,
  getParentKey,
  isKeyAncestorOf,
  hasNoMatchingAncestors,
  findField,
  isAncestor,
  isDecendant,
  getRecordNodeId,
  getRecordNodeIdFromId,
  getRecordNodeById,
  recordNodeIdIsAllowed,
  recordNodeIsAllowed,
  getAllowedRecordNodesForIndex,
  getNodeFromNodeKeyHash,
  isModel,
  isCollectionRecord,
  isIndex,
  isaggregateGroup,
  isShardedIndex,
  isRoot,
  isDecendantOfARecord,
  isGlobalIndex,
  isReferenceIndex,
  isAncestorIndex,
  fieldReversesReferenceToNode,
  fieldReversesReferenceToIndex,
  getFlattenedHierarchy,
  isTopLevelIndex,
  isTopLevelRecord,
  nodeNameFromNodeKey,
}
