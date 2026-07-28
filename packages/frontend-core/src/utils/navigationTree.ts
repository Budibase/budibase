import { AppNavigationLink } from "@budibase/types"
import { MAX_NAV_DEPTH } from "@budibase/shared-core"

export { MAX_NAV_DEPTH }

export const isNavGroup = (node: AppNavigationLink): boolean =>
  node.type === "sublinks"

// A node at `depth` (0-based) may hold children only while its children stay
// within MAX_NAV_DEPTH.
export const canNavNest = (depth: number): boolean => depth < MAX_NAV_DEPTH - 1

export const walkNav = (
  links: AppNavigationLink[],
  cb: (
    node: AppNavigationLink,
    depth: number,
    parent?: AppNavigationLink
  ) => void,
  depth = 0,
  parent?: AppNavigationLink
): void => {
  for (const node of links || []) {
    cb(node, depth, parent)
    if (node.subLinks?.length) {
      walkNav(node.subLinks, cb, depth + 1, node)
    }
  }
}

export const findNavNode = (
  links: AppNavigationLink[],
  id: string
): AppNavigationLink | undefined => {
  for (const node of links || []) {
    if (node.id === id) {
      return node
    }
    if (node.subLinks?.length) {
      const found = findNavNode(node.subLinks, id)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

// Returns the chain of nodes from the root down to (and including) the target.
export const findNavPath = (
  links: AppNavigationLink[],
  id: string,
  trail: AppNavigationLink[] = []
): AppNavigationLink[] | null => {
  for (const node of links || []) {
    const next = [...trail, node]
    if (node.id === id) {
      return next
    }
    if (node.subLinks?.length) {
      const found = findNavPath(node.subLinks, id, next)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const navChildrenOf = (
  links: AppNavigationLink[],
  parentId: string | null
): AppNavigationLink[] => {
  if (parentId == null) {
    return links || []
  }
  return findNavNode(links, parentId)?.subLinks || []
}

export const updateNavNode = (
  links: AppNavigationLink[],
  id: string,
  patch: Partial<AppNavigationLink>
): AppNavigationLink[] =>
  (links || []).map(node => {
    if (node.id === id) {
      return { ...node, ...patch }
    }
    if (node.subLinks?.length) {
      return { ...node, subLinks: updateNavNode(node.subLinks, id, patch) }
    }
    return node
  })

export const removeNavNode = (
  links: AppNavigationLink[],
  id: string
): AppNavigationLink[] =>
  (links || [])
    .filter(node => node.id !== id)
    .map(node =>
      node.subLinks?.length
        ? { ...node, subLinks: removeNavNode(node.subLinks, id) }
        : node
    )

// Appends a child to the given parent (top level when parentId is null),
// promoting the parent to a group.
export const addNavChild = (
  links: AppNavigationLink[],
  parentId: string | null,
  child: AppNavigationLink
): AppNavigationLink[] => {
  if (parentId == null) {
    return [...(links || []), child]
  }
  return (links || []).map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        type: "sublinks" as const,
        subLinks: [...(node.subLinks || []), child],
      }
    }
    if (node.subLinks?.length) {
      return { ...node, subLinks: addNavChild(node.subLinks, parentId, child) }
    }
    return node
  })
}

export interface EnforceMinRoleResult {
  links: AppNavigationLink[]
  // Labels of the descendants whose explicit role was raised, so callers can
  // tell the user what changed instead of mutating data silently.
  raised: string[]
}

// After a group's role changes, raise descendants whose OWN explicit role is
// less restrictive than their parent's, so a child can never be offered to an
// audience that cannot reach its parent.
//
// Nodes without a roleId are left untouched: they inherit their parent's role
// at runtime (see filterNavTree), so they already satisfy the rule and pinning
// them would silently turn inheritance into a fixed role.
//
// `isAllowedUnder(roleId, parentRoleId)` decides the per-level rule, keeping
// this module independent of the roles store.
export const enforceSubtreeMinRole = (
  links: AppNavigationLink[],
  groupId: string,
  newRole: string,
  isAllowedUnder: (roleId: string, parentRoleId: string) => boolean
): EnforceMinRoleResult => {
  const raised: string[] = []

  const raise = (
    nodes: AppNavigationLink[],
    minRole: string
  ): AppNavigationLink[] =>
    (nodes || []).map(node => {
      // No explicit role means "inherit" - nothing to enforce or rewrite.
      const violates = !!node.roleId && !isAllowedUnder(node.roleId, minRole)
      if (violates) {
        raised.push(node.text || "Untitled")
      }
      const roleId = violates ? newRole : node.roleId
      return {
        ...node,
        ...(violates ? { roleId } : {}),
        // Children are held to their parent's effective role.
        ...(node.subLinks?.length
          ? { subLinks: raise(node.subLinks, roleId || minRole) }
          : {}),
      }
    })

  const walk = (nodes: AppNavigationLink[]): AppNavigationLink[] =>
    (nodes || []).map(node => {
      if (node.id === groupId) {
        return node.subLinks?.length
          ? { ...node, subLinks: raise(node.subLinks, newRole) }
          : node
      }
      if (node.subLinks?.length) {
        return { ...node, subLinks: walk(node.subLinks) }
      }
      return node
    })

  return { links: walk(links), raised }
}

// The role a node is effectively gated by: its own, else the nearest ancestor
// with an explicit role, else the given default. Mirrors how filterNavTree
// resolves roles at runtime.
export const effectiveNavRole = (
  path: AppNavigationLink[],
  defaultRole: string
): string => {
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i]?.roleId) {
      return path[i].roleId!
    }
  }
  return defaultRole
}

export interface FilterNavTreeOptions {
  // Role ids the current user can access; a node is visible when its
  // (inherited) role is in this list.
  userRoleHierarchy: string[]
  // Role assumed for top level items without an explicit roleId.
  defaultRole: string
  // Route-level access check, applied to links only (not groups).
  canAccessLink: (node: AppNavigationLink) => boolean
  // Conditional UI evaluation for a node.
  evaluateConditions: (node: AppNavigationLink) => boolean
  // Per-node enrichment (e.g. resolving internal/external links).
  enrich: (node: AppNavigationLink) => AppNavigationLink
}

// Filters and enriches a navigation tree for the current user: strips nodes
// without text, links without URLs, nodes above the user's role and nodes
// failing their conditions; caps nesting at MAX_NAV_DEPTH and drops groups
// left without visible children. A child without its own role inherits its
// parent's, so legacy sub links stay visible whenever their parent is.
// Note: canAccessLink (route reachability) is only applied to nested links,
// matching the pre-tree behaviour where top level links were never
// route-checked.
export const filterNavTree = (
  links: AppNavigationLink[],
  opts: FilterNavTreeOptions
): AppNavigationLink[] => {
  const {
    userRoleHierarchy,
    defaultRole,
    canAccessLink,
    evaluateConditions,
    enrich,
  } = opts
  const hasRole = (role: string) =>
    !!userRoleHierarchy?.find(roleId => roleId === role)

  const filterChild = (
    node: AppNavigationLink,
    depth: number,
    parentRole: string
  ): AppNavigationLink | null => {
    if (!node.text) {
      return null
    }
    const group = isNavGroup(node)
    if (!group && !canAccessLink(node)) {
      return null
    }
    const role = node.roleId || parentRole
    if (!hasRole(role)) {
      return null
    }
    if (!evaluateConditions(node)) {
      return null
    }
    const enriched = enrich(node)
    if (group) {
      const children =
        depth < MAX_NAV_DEPTH - 1
          ? (node.subLinks || [])
              .map(child => filterChild(child, depth + 1, role))
              .filter((child): child is AppNavigationLink => !!child)
          : []
      if (!children.length) {
        return null
      }
      enriched.subLinks = children
    }
    return enriched
  }

  return (links || [])
    .filter(node => {
      if (!node.text) {
        return false
      }
      if (!isNavGroup(node) && !node.url) {
        return false
      }
      if (!hasRole(node.roleId || defaultRole)) {
        return false
      }
      return evaluateConditions(node)
    })
    .map(node => {
      const enriched = enrich(node)
      if (isNavGroup(node) && node.subLinks?.length) {
        enriched.subLinks = node.subLinks
          .map(child => filterChild(child, 1, node.roleId || defaultRole))
          .filter((child): child is AppNavigationLink => !!child)
      }
      return enriched
    })
    .filter(node => !isNavGroup(node) || (node.subLinks?.length ?? 0) > 0)
}

// Removes links pointing at any of the given URLs, at every depth. A group
// whose header links to such a URL keeps its children and only loses the URL,
// so deleting one screen never silently deletes a whole subtree.
export const pruneNavLinksByUrl = (
  links: AppNavigationLink[],
  urls: string[]
): AppNavigationLink[] =>
  (links || [])
    .filter(node => node.type === "sublinks" || !urls.includes(node.url))
    .map(node =>
      node.type === "sublinks"
        ? {
            ...node,
            url: urls.includes(node.url) ? "" : node.url,
            subLinks: pruneNavLinksByUrl(node.subLinks || [], urls),
          }
        : node
    )

// Replaces the children of the given parent (top level when parentId is null)
// with a reordered array.
export const reorderNavChildren = (
  links: AppNavigationLink[],
  parentId: string | null,
  ordered: AppNavigationLink[]
): AppNavigationLink[] => {
  if (parentId == null) {
    return ordered
  }
  return (links || []).map(node => {
    if (node.id === parentId) {
      return { ...node, subLinks: ordered }
    }
    if (node.subLinks?.length) {
      return {
        ...node,
        subLinks: reorderNavChildren(node.subLinks, parentId, ordered),
      }
    }
    return node
  })
}
