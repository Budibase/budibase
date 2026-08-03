import {
  type BuildFunctionRequest,
  type BuildFunctionResponse,
  type CompileFunctionRequest,
  type CompileFunctionResponse,
  type CreateFunctionRequest,
  type CreateFunctionResponse,
  type FetchFunctionResponse,
  type FetchFunctionRunResponse,
  type FetchFunctionRunsResponse,
  type FetchFunctionQueryCatalogResponse,
  type FetchFunctionsResponse,
  type UpdateFunctionRequest,
  type UpdateFunctionResponse,
  type UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"

export const fetch = async (ctx: UserCtx<void, FetchFunctionsResponse>) => {
  const functions = await sdk.functions.fetch()
  ctx.body = {
    functions: await Promise.all(
      functions.map(fn => sdk.functions.toFunctionResponse(fn))
    ),
  }
}

export const queryCatalog = async (
  ctx: UserCtx<void, FetchFunctionQueryCatalogResponse>
) => {
  ctx.body = {
    queries: await sdk.functions.getQueryCatalog(),
  }
}

export const compile = async (
  ctx: UserCtx<CompileFunctionRequest, CompileFunctionResponse>
) => {
  ctx.body = {
    diagnostics: await sdk.functions.compile(ctx.request.body),
  }
}

export const build = async (
  ctx: UserCtx<BuildFunctionRequest, BuildFunctionResponse>
) => {
  const fn = await sdk.functions.build(ctx.params.id, ctx.request.body._rev)
  ctx.body = {
    function: await sdk.functions.toFunctionResponse(fn),
  }
}

export const find = async (ctx: UserCtx<void, FetchFunctionResponse>) => {
  const fn = await sdk.functions.get(ctx.params.id)
  if (!fn) {
    ctx.throw(404, `Function with id '${ctx.params.id}' not found.`)
  }
  ctx.body = {
    function: await sdk.functions.toFunctionResponse(fn),
  }
}

export const create = async (
  ctx: UserCtx<CreateFunctionRequest, CreateFunctionResponse>
) => {
  const fn = await sdk.functions.create(ctx.appId, ctx.request.body)
  ctx.status = 201
  ctx.body = {
    function: await sdk.functions.toFunctionResponse(fn),
  }
}

export const update = async (
  ctx: UserCtx<UpdateFunctionRequest, UpdateFunctionResponse>
) => {
  const fn = await sdk.functions.update({
    _id: ctx.params.id,
    ...ctx.request.body,
  })
  ctx.body = {
    function: await sdk.functions.toFunctionResponse(fn),
  }
}

export const remove = async (ctx: UserCtx<void, void>) => {
  await sdk.functions.remove(ctx.params.id, ctx.params.rev)
  ctx.status = 204
}

export const fetchRuns = async (
  ctx: UserCtx<void, FetchFunctionRunsResponse>
) => {
  const fn = await sdk.functions.get(ctx.params.id)
  if (!fn) {
    ctx.throw(404, `Function with id '${ctx.params.id}' not found.`)
  }
  const bookmark =
    typeof ctx.query.bookmark === "string" ? ctx.query.bookmark : undefined
  if (bookmark && bookmark.length > 2048) {
    ctx.throw(400, "Function run history bookmark is too long.")
  }
  let limit: number | undefined
  if (typeof ctx.query.limit === "string") {
    limit = Number(ctx.query.limit)
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      ctx.throw(400, "Function run history limit must be between 1 and 100.")
    }
  }
  ctx.body = await sdk.functions.listRunHistory(ctx.params.id, bookmark, limit)
}

export const findRun = async (ctx: UserCtx<void, FetchFunctionRunResponse>) => {
  const fn = await sdk.functions.get(ctx.params.id)
  if (!fn) {
    ctx.throw(404, `Function with id '${ctx.params.id}' not found.`)
  }
  const run = await sdk.functions.getRunHistory(ctx.params.id, ctx.params.runId)
  if (!run) {
    ctx.throw(404, `Function run '${ctx.params.runId}' not found.`)
  }
  ctx.body = { run }
}
