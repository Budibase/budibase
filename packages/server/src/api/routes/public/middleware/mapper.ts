import mapping from "../../../controllers/public/mapping"

enum Resources {
  APPLICATION = "applications",
  TABLES = "tables",
  ROWS = "rows",
  USERS = "users",
  QUERIES = "queries",
  SEARCH = "search",
}

function isArrayResponse(ctx: any) {
  return ctx.url.endsWith(Resources.SEARCH) || Array.isArray(ctx.body)
}

function processApplications(ctx: any) {
  if (isArrayResponse(ctx)) {
    return mapping.mapApplications(ctx)
  } else {
    return mapping.mapApplication(ctx)
  }
}

function processTables(ctx: any) {
  if (isArrayResponse(ctx)) {
    return mapping.mapTables(ctx)
  } else {
    return mapping.mapTable(ctx)
  }
}

function processRows(ctx: any) {
  if (isArrayResponse(ctx)) {
    return mapping.mapRowSearch(ctx)
  } else {
    return mapping.mapRow(ctx)
  }
}

function processUsers(ctx: any) {
  if (isArrayResponse(ctx)) {
    return mapping.mapUsers(ctx)
  } else {
    return mapping.mapUser(ctx)
  }
}

function processQueries(ctx: any) {
  if (isArrayResponse(ctx)) {
    return mapping.mapQueries(ctx)
  } else {
    return mapping.mapQueryExecution(ctx)
  }
}

export default async (ctx: any, next: any) => {
  if (!ctx.body) {
    return await next()
  }
  let urlParts = ctx.url.split("/")
  urlParts = urlParts.slice(4, urlParts.length)
  let body = {}

  switch (urlParts[0]) {
    case Resources.APPLICATION:
      body = processApplications(ctx)
      break
    case Resources.TABLES:
      if (urlParts[2] === Resources.ROWS) {
        body = processRows(ctx)
      } else {
        body = processTables(ctx)
      }
      break
    case Resources.USERS:
      body = processUsers(ctx)
      break
    case Resources.QUERIES:
      body = processQueries(ctx)
      break
  }
  // update the body based on what has occurred in the mapper
  ctx.body = body
  await next()
}
