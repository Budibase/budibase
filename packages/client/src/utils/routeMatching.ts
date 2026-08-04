const stripQueryString = (route?: string) => {
  if (!route) {
    return route
  }

  try {
    return new URL(route, "http://example.com").pathname
  } catch (error) {
    return route
  }
}

interface RouteMatchPatternArgs {
  pattern?: string
  route?: string
}

export const routeMatchesPattern = ({
  pattern,
  route,
}: RouteMatchPatternArgs = {}) => {
  // Strip query strings from the concrete URL so values like
  // /product/55?nav=details still match a route pattern such as /product/:id.
  const routePath = stripQueryString(route)
  const routePattern = pattern

  if (!routePattern || !routePath) {
    return false
  }

  if (routePattern === routePath) {
    return true
  }

  const patternSegments = routePattern.split("/").filter(Boolean)
  const routeSegments = routePath.split("/").filter(Boolean)

  const optionalTrailingSegmentCount = (() => {
    let count = 0
    for (let index = patternSegments.length - 1; index >= 0; index--) {
      const segment = patternSegments[index]
      if (!segment.startsWith(":") || !segment.endsWith("?")) {
        break
      }
      count++
    }
    return count
  })()

  const minSegmentCount = patternSegments.length - optionalTrailingSegmentCount

  if (
    routeSegments.length < minSegmentCount ||
    routeSegments.length > patternSegments.length
  ) {
    return false
  }

  // Treat ":param" segments as wildcards so dynamic routes like /product/:id
  // match concrete URLs like /product/55. A trailing ":param?" segment may be
  // omitted entirely, which keeps routes like /customers/:id/details/:tab?
  // matched by /customers/55/details.
  for (let index = 0; index < patternSegments.length; index++) {
    const patternSegment = patternSegments[index]
    const routeSegment = routeSegments[index]

    if (!routeSegment) {
      return patternSegment.startsWith(":") && patternSegment.endsWith("?")
    }

    if (patternSegment.startsWith(":")) {
      continue
    }

    if (patternSegment !== routeSegment) {
      return false
    }
  }
  return true
}
