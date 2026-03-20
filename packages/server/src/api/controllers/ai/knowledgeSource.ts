import {
  CreateKnowledgeSourceRequest,
  KnowledgeSource,
  KnowledgeSourceListResponse,
  UpdateKnowledgeSourceRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export const fetchKnowledgeSources = async (
  ctx: UserCtx<void, KnowledgeSourceListResponse, { knowledgeBaseId?: string }>
) => {
  const { knowledgeBaseId } = ctx.params

  const sources = await sdk.ai.knowledgeSource.fetch(knowledgeBaseId)
  ctx.body = sources
}

export const createKnowledgeSource = async (
  ctx: UserCtx<CreateKnowledgeSourceRequest, KnowledgeSource>
) => {
  const body = ctx.request.body
  const created = await sdk.ai.knowledgeSource.create(body)
  ctx.body = created
  ctx.status = 201
}

export const updateKnowledgeSource = async (
  ctx: UserCtx<UpdateKnowledgeSourceRequest, KnowledgeSource>
) => {
  const body = ctx.request.body
  const updated = await sdk.ai.knowledgeSource.update(body)
  ctx.body = updated
}

export const deleteKnowledgeSource = async (
  ctx: UserCtx<void, { deleted: true }, { id: string }>
) => {
  const { id } = ctx.params
  await sdk.ai.knowledgeSource.remove(id)
  ctx.body = { deleted: true }
}
