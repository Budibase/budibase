export const getRouteWithoutQueryParams = (route?: string) => {
  if (!route) {
    return route
  }

  try {
    return new URL(route, "http://example.com").pathname
  } catch (error) {
    return route
  }
}

export const routeMatchesPattern = (pattern?: string, route?: string) => {
  // Strip query strings so values like /product/55?nav=details still match
  // a route pattern such as /product/:id.
  const routePattern = getRouteWithoutQueryParams(pattern)
  const routePath = getRouteWithoutQueryParams(route)

  if (!routePattern || !routePath) {
    return false
  }

  if (routePattern === routePath) {
    return true
  }

  const patternSegments = routePattern.split("/").filter(Boolean)
  const routeSegments = routePath.split("/").filter(Boolean)

  if (patternSegments.length !== routeSegments.length) {
    return false
  }

  // Treat ":param" segments as wildcards so dynamic routes like /product/:id
  // match concrete URLs like /product/55.
  return patternSegments.every((segment, index) => {
    return segment.startsWith(":") || segment === routeSegments[index]
  })
}
