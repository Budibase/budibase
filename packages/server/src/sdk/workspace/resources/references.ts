import { decodeJSBinding, findHBSBlocks } from "@budibase/string-templates"
import type { AnyDocument, UsedResource } from "@budibase/types"

export interface ResourceSearchTarget extends UsedResource {
  idToSearch: string
  extraDependencies?: UsedResource[]
  matchInBindings?: boolean
  matchInEnabledTools?: boolean
  matchExactly?: boolean
}

const matchesBinding = (block: string, target: ResourceSearchTarget) => {
  if (target.matchInBindings === false) {
    return false
  }
  if (target.matchExactly === false) {
    const escapedTarget = target.idToSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )
    return new RegExp(
      `(?:^|[^A-Za-z0-9_.-])${escapedTarget}(?![A-Za-z0-9_-])`
    ).test(block)
  }
  return (
    block.includes(`${target.idToSearch}.`) ||
    block.includes(`[${target.idToSearch}]`)
  )
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

  const addStringMatches = (value: string, property?: string) => {
    const blocks = findHBSBlocks(value).map(getSearchableBinding)
    for (const target of targets) {
      const exactMatch =
        target.matchExactly !== false && value === target.idToSearch
      const enabledToolMatch =
        property === "enabledTools" &&
        target.matchInEnabledTools &&
        value === target.idToSearch
      const bindingMatch = blocks.some(block => matchesBinding(block, target))
      if (exactMatch || enabledToolMatch || bindingMatch) {
        matchedIds.add(target.id)
      }
    }
  }

  const visit = (value: unknown, property?: string) => {
    if (typeof value === "string") {
      addStringMatches(value, property)
      return
    }
    if (Array.isArray(value)) {
      value.forEach(item => visit(item, property))
      return
    }
    if (!value || typeof value !== "object") {
      return
    }
    for (const [key, nestedValue] of Object.entries(value)) {
      addStringMatches(key)
      const nestedProperty =
        property === "enabledTools" && key === "toolName" ? property : key
      visit(nestedValue, nestedProperty)
    }
  }

  visit(resource)
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
