import {
  CreateKnowledgeBaseRequest,
  KnowledgeBase,
  KnowledgeBaseListResponse,
  SyncKnowledgeBaseRequest,
  SyncKnowledgeBaseResponse,
  UpdateKnowledgeBaseRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export const fetchKnowledgeBases = async (
  ctx: UserCtx<void, KnowledgeBaseListResponse>
) => {
  const configs = await sdk.ai.knowledgeBase.fetch()
  ctx.body = configs
}

export const createKnowledgeBase = async (
  ctx: UserCtx<CreateKnowledgeBaseRequest, KnowledgeBase>
) => {
  const body = ctx.request.body
  const created = await sdk.ai.knowledgeBase.create(body)
  ctx.body = created
  ctx.status = 201
}

export const updateKnowledgeBase = async (
  ctx: UserCtx<UpdateKnowledgeBaseRequest, KnowledgeBase>
) => {
  const body = ctx.request.body
  const updated = await sdk.ai.knowledgeBase.update(body)
  ctx.body = updated
}

export const deleteKnowledgeBase = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  await sdk.ai.knowledgeBase.remove(id)
  ctx.body = { deleted: true }
}

export const syncKnowledgeBase = async (
  ctx: UserCtx<
    SyncKnowledgeBaseRequest,
    SyncKnowledgeBaseResponse,
    { id: string }
  >
) => {
  const { id } = ctx.params
  const { datasourceId, siteId } = ctx.request.body || {}
  ctx.body = await sdk.ai.knowledgeBase.sync({
    knowledgeBaseId: id,
    datasourceId,
    siteId,
  })
}
