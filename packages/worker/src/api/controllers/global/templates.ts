import {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} from "../../../constants"
import { getTemplates } from "../../../constants/templates"
import { tenancy, db as dbCore } from "@budibase/backend-core"

export async function save(ctx: any) {
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

export async function definitions(ctx: any) {
  const bindings: any = {}
  const info: any = {}
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

export async function fetch(ctx: any) {
  ctx.body = await getTemplates()
}

export async function fetchByType(ctx: any) {
  // @ts-ignore
  ctx.body = await getTemplates({
    type: ctx.params.type,
  })
}

export async function fetchByOwner(ctx: any) {
  // @ts-ignore
  ctx.body = await getTemplates({
    ownerId: ctx.params.ownerId,
  })
}

export async function find(ctx: any) {
  // @ts-ignore
  ctx.body = await getTemplates({
    id: ctx.params.id,
  })
}

export async function destroy(ctx: any) {
  const db = tenancy.getGlobalDB()
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.message = `Template ${ctx.params.id} deleted.`
  ctx.status = 200
}
