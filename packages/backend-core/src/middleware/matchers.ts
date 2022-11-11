import { BBContext, EndpointMatcher, RegexMatcher } from "@budibase/types"

const PARAM_REGEX = /\/:(.*?)(\/.*)?$/g

export const buildMatcherRegex = (
  patterns: EndpointMatcher[]
): RegexMatcher[] => {
  if (!patterns) {
    return []
  }
  return patterns.map(pattern => {
    let route = pattern.route
    const method = pattern.method
    const strict = pattern.strict ? pattern.strict : false

    // if there is a param in the route
    // use a wildcard pattern
    const matches = route.match(PARAM_REGEX)
    if (matches) {
      for (let match of matches) {
        const suffix = match.endsWith("/") ? "/" : ""
        const pattern = "/.*" + suffix
        route = route.replace(match, pattern)
      }
    }

    return { regex: new RegExp(route), method, strict, route }
  })
}

export const matches = (ctx: BBContext, options: RegexMatcher[]) => {
  return options.find(({ regex, method, strict, route }) => {
    let urlMatch
    if (strict) {
      urlMatch = ctx.request.url === route
    } else {
      urlMatch = regex.test(ctx.request.url)
    }

    const methodMatch =
      method === "ALL"
        ? true
        : ctx.request.method.toLowerCase() === method.toLowerCase()

    return urlMatch && methodMatch
  })
}
