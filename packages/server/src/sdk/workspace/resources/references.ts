import { decodeJSBinding, findHBSBlocks } from "@budibase/string-templates"
import type { AnyDocument, UsedResource } from "@budibase/types"

export interface ResourceSearchTarget extends UsedResource {
  idToSearch: string
  extraDependencies?: UsedResource[]
  matchInBindings?: boolean
  matchInEnabledTools?: boolean
  matchExactly?: boolean
}

const STRUCTURED_REFERENCE_PROPERTIES = new Set(["_id", "dependencies", "id"])

const isStructuredReferenceProperty = (property?: string) =>
  !!property &&
  (STRUCTURED_REFERENCE_PROPERTIES.has(property) || /Ids?$/.test(property))

const matchesExactBinding = ({
  block,
  target,
}: {
  block: string
  target: ResourceSearchTarget
}) =>
  block.includes(`${target.idToSearch}.`) ||
  block.includes(`[${target.idToSearch}]`)

const getReadableBindingMatchIndexes = ({
  block,
  target,
}: {
  block: string
  target: ResourceSearchTarget
}) => {
  const escapedTarget = target.idToSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(
    `(^|[^A-Za-z0-9_.-])${escapedTarget}(?![A-Za-z0-9_-])`,
    "g"
  )

  return Array.from(
    block.matchAll(pattern),
    match => (match.index ?? 0) + (match[1]?.length ?? 0)
  )
}

const getBindingMatches = ({
  blocks,
  targets,
}: {
  blocks: string[]
  targets: ResourceSearchTarget[]
}) => {
  const matchedIds = new Set<string>()

  for (const block of blocks) {
    const readableMatches = targets.flatMap(target => {
      if (target.matchInBindings === false) {
        return []
      }
      if (target.matchExactly !== false) {
        if (matchesExactBinding({ block, target })) {
          matchedIds.add(target.id)
        }
        return []
      }
      return getReadableBindingMatchIndexes({ block, target }).map(index => ({
        index,
        target,
      }))
    })
    const longestReadableMatchByIndex = new Map<number, number>()
    for (const match of readableMatches) {
      longestReadableMatchByIndex.set(
        match.index,
        Math.max(
          longestReadableMatchByIndex.get(match.index) || 0,
          match.target.idToSearch.length
        )
      )
    }
    for (const match of readableMatches) {
      if (
        match.target.idToSearch.length ===
        longestReadableMatchByIndex.get(match.index)
      ) {
        matchedIds.add(match.target.id)
      }
    }
  }

  return matchedIds
}

const getSearchableBinding = (block: string) => {
  try {
    return decodeJSBinding(block) ?? block
  } catch {
    return block
  }
}

export const findResourceSearchTargets = ({
  resource,
  targets,
}: {
  resource: AnyDocument
  targets: ResourceSearchTarget[]
}) => {
  const matchedIds = new Set<string>()

  const addStringMatches = ({
    value,
    property,
    isObjectKey = false,
  }: {
    value: string
    property?: string
    isObjectKey?: boolean
  }) => {
    const blocks = findHBSBlocks(value).map(getSearchableBinding)
    const bindingMatches = getBindingMatches({ blocks, targets })
    for (const target of targets) {
      const exactMatch =
        target.matchExactly !== false &&
        value === target.idToSearch &&
        (isObjectKey || isStructuredReferenceProperty(property))
      const enabledToolMatch =
        property === "enabledTools" &&
        target.matchInEnabledTools &&
        value === target.idToSearch
      if (exactMatch || enabledToolMatch || bindingMatches.has(target.id)) {
        matchedIds.add(target.id)
      }
    }
  }

  const visit = ({
    value,
    property,
  }: {
    value: unknown
    property?: string
  }) => {
    if (typeof value === "string") {
      addStringMatches({ value, property })
      return
    }
    if (Array.isArray(value)) {
      value.forEach(item => visit({ value: item, property }))
      return
    }
    if (!value || typeof value !== "object") {
      return
    }
    for (const [key, nestedValue] of Object.entries(value)) {
      addStringMatches({ value: key, isObjectKey: true })
      const nestedProperty =
        property === "enabledTools" && key === "toolName" ? property : key
      visit({ value: nestedValue, property: nestedProperty })
    }
  }

  visit({ value: resource })
  const returnedIds = new Set<string>()
  return targets.filter(target => {
    if (!matchedIds.has(target.id) || returnedIds.has(target.id)) {
      return false
    }
    returnedIds.add(target.id)
    return true
  })
}

export const createSearchTarget = ({
  id,
  name,
  type,
}: UsedResource): ResourceSearchTarget => ({
  id,
  idToSearch: id,
  name,
  type,
})

export const createBindingSearchTarget = ({
  resource,
  binding,
}: {
  resource: UsedResource
  binding: string
}): ResourceSearchTarget => ({
  ...resource,
  idToSearch: binding,
  matchExactly: false,
})

export const createToolSearchTarget = ({
  resource,
  toolName,
}: {
  resource: UsedResource
  toolName: string
}): ResourceSearchTarget => ({
  ...resource,
  idToSearch: toolName,
  matchExactly: false,
  matchInBindings: false,
  matchInEnabledTools: true,
})
