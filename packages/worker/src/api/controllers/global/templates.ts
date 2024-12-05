import {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} from "../../../constants"
import { getTemplateByID, getTemplates } from "../../../constants/templates"
import { tenancy, db as dbCore } from "@budibase/backend-core"
import {
  DeleteTemplateResponse,
  FetchTemplateByOwnerIDResponse,
  FetchTemplateByTypeResponse,
  FetchTemplateDefinitionResponse,
  FetchTemplateResponse,
  FindTemplateResponse,
  SaveTemplateRequest,
  SaveTemplateResponse,
  TemplateBinding,
  TemplateDefinition,
  UserCtx,
} from "@budibase/types"

export async function save(
  ctx: UserCtx<SaveTemplateRequest, SaveTemplateResponse>
) {
  const db = tenancy.getGlobalDB()
  let template = ctx.request.body
  if (!template.ownerId) {
    template.ownerId = GLOBAL_OWNER
  }
  if (!template._id) {
    template._id = dbCore.generateTemplateID(template.ownerId)
  }

  const response = await db.put(template)
  ctx.body = {
    ...template,
    _rev: response.rev,
  }
}

export async function definitions(
  ctx: UserCtx<void, FetchTemplateDefinitionResponse>
) {
  const bindings: Record<string, TemplateBinding[]> = {}
  const info: Record<string, TemplateDefinition> = {}
  for (let template of TemplateMetadata.email) {
    bindings[template.purpose] = template.bindings
    info[template.purpose] = {
      name: template.name,
      description: template.description,
      category: template.category,
    }
  }

  ctx.body = {
    info,
    bindings: {
      ...bindings,
      common: Object.values(TemplateBindings),
    },
  }
}

export async function fetch(ctx: UserCtx<void, FetchTemplateResponse>) {
  ctx.body = await getTemplates()
}

export async function fetchByType(
  ctx: UserCtx<void, FetchTemplateByTypeResponse>
) {
  ctx.body = await getTemplates({
    type: ctx.params.type,
  })
}

export async function fetchByOwner(
  ctx: UserCtx<void, FetchTemplateByOwnerIDResponse>
) {
  // @ts-ignore
  ctx.body = await getTemplates({
    ownerId: ctx.params.ownerId,
  })
}

export async function find(ctx: UserCtx<void, FindTemplateResponse>) {
  ctx.body = await getTemplateByID(ctx.params.id)
}

export async function destroy(ctx: UserCtx<void, DeleteTemplateResponse>) {
  const db = tenancy.getGlobalDB()
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.body = { message: `Template ${ctx.params.id} deleted.` }
}
