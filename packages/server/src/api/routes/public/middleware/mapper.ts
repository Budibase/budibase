import { Ctx } from "@budibase/types"
import mapping from "../../../controllers/public/mapping"

enum Resource {
  APPLICATION = "applications",
  TABLES = "tables",
  VIEWS = "views",
  ROWS = "rows",
  USERS = "users",
  QUERIES = "queries",
  SEARCH = "search",
}

function isAttachment(ctx: Ctx) {
  return ctx.body?.path && ctx.body?.flags && ctx.body?.mode
}

function isArrayResponse(ctx: Ctx) {
  return ctx.url.endsWith(Resource.SEARCH) || Array.isArray(ctx.body)
}

function noResponse(ctx: Ctx) {
  return !Array.isArray(ctx.body) && Object.keys(ctx.body).length === 0
}

function processApplications(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapApplications(ctx)
  } else {
    return mapping.mapApplication(ctx)
  }
}

function processTables(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapTables(ctx)
  } else {
    return mapping.mapTable(ctx)
  }
}

function processViews(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapViews(ctx)
  } else {
    return mapping.mapView(ctx)
  }
}

function processRows(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapRowSearch(ctx)
  } else {
    return mapping.mapRow(ctx)
  }
}

function processUsers(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapUsers(ctx)
  } else {
    return mapping.mapUser(ctx)
  }
}

function processQueries(ctx: Ctx) {
  if (isArrayResponse(ctx)) {
    return mapping.mapQueries(ctx)
  } else {
    return mapping.mapQueryExecution(ctx)
  }
}

export default async (ctx: Ctx, next: any) => {
  if (!ctx.body || noResponse(ctx) || isAttachment(ctx)) {
    return await next()
  }
  let urlParts = ctx.url.split("/")
  urlParts = urlParts.slice(4, urlParts.length)
  let body = {}

  switch (urlParts[0]) {
    case Resource.APPLICATION:
      body = processApplications(ctx)
      break
    case Resource.TABLES:
      if (urlParts[2] === Resource.ROWS) {
        body = processRows(ctx)
      } else {
        body = processTables(ctx)
      }
      break
    case Resource.VIEWS:
      if (urlParts[2] === Resource.ROWS) {
        body = processRows(ctx)
      } else {
        body = processViews(ctx)
      }
      break
    case Resource.USERS:
      body = processUsers(ctx)
      break
    case Resource.QUERIES:
      body = processQueries(ctx)
      break
  }
  // update the body based on what has occurred in the mapper
  ctx.body = body
  await next()
}
