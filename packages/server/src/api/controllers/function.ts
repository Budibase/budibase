import {
  type CreateFunctionRequest,
  type CreateFunctionResponse,
  type FetchFunctionResponse,
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
