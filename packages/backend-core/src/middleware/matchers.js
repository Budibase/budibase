const PARAM_REGEX = /\/:(.*?)(\/.*)?$/g

exports.buildMatcherRegex = patterns => {
  if (!patterns) {
    return []
  }
  return patterns.map(pattern => {
    const isObj = typeof pattern === "object" && pattern.route
    const method = isObj ? pattern.method : "GET"
    const strict = pattern.strict ? pattern.strict : false
    let route = isObj ? pattern.route : pattern

    const matches = route.match(PARAM_REGEX)
    if (matches) {
      for (let match of matches) {
        const pattern = "/.*" + (match.endsWith("/") ? "/" : "")
        route = route.replace(match, pattern)
      }
    }
    return { regex: new RegExp(route), method, strict, route }
  })
}

exports.matches = (ctx, options) => {
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
