const { generateTemplateID, getGlobalDBFromCtx } = require("@budibase/auth/db")
const {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} = require("../../../constants")
const { getTemplates } = require("../../../constants/templates")

exports.save = async ctx => {
  const db = getGlobalDBFromCtx(ctx)
  let template = ctx.request.body
  if (!template.ownerId) {
    template.ownerId = GLOBAL_OWNER
  }
  if (!template._id) {
    template._id = generateTemplateID(template.ownerId)
  }

  const response = await db.put(template)
  ctx.body = {
    ...template,
    _rev: response.rev,
  }
}

exports.definitions = async ctx => {
  const bindings = {}

  for (let template of TemplateMetadata.email) {
    bindings[template.purpose] = template.bindings
  }

  ctx.body = {
    bindings: {
      ...bindings,
      common: Object.values(TemplateBindings),
    },
  }
}

exports.fetch = async ctx => {
  ctx.body = await getTemplates(ctx)
}

exports.fetchByType = async ctx => {
  ctx.body = await getTemplates(ctx, {
    type: ctx.params.type,
  })
}

exports.fetchByOwner = async ctx => {
  ctx.body = await getTemplates(ctx, {
    ownerId: ctx.params.ownerId,
  })
}

exports.find = async ctx => {
  ctx.body = await getTemplates(ctx, {
    id: ctx.params.id,
  })
}

exports.destroy = async ctx => {
  const db = getGlobalDBFromCtx(ctx)
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.message = `Template ${ctx.params.id} deleted.`
  ctx.status = 200
}
