import { AppNavigationLink } from "@budibase/types"
import { MAX_NAV_DEPTH } from "../constants"

// Depth is 1-based here: a top level link is depth 1, so a tree is too deep as
// soon as a link sits at MAX_NAV_DEPTH + 1. Use this rather than repeating the
// arithmetic, which is easy to get off by one against the 0-based `depth` the
// renderer and the editor pass around.
export const exceedsNavDepth = (depth: number): boolean => depth > MAX_NAV_DEPTH

// Returns the first link nested deeper than MAX_NAV_DEPTH, or undefined when the
// tree is within the limit. Returning the offending link lets callers name it in
// an error message instead of failing anonymously.
export const findNavDepthViolation = (
  links: AppNavigationLink[],
  depth = 1
): AppNavigationLink | undefined => {
  for (const link of links || []) {
    if (exceedsNavDepth(depth)) {
      return link
    }
    if (link.subLinks?.length) {
      const violation = findNavDepthViolation(link.subLinks, depth + 1)
      if (violation) {
        return violation
      }
    }
  }
  return undefined
}
