const { generateTemplateID } = require("@budibase/auth/db")
const { getGlobalDB } = require("@budibase/auth").tenancy
const {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} = require("../../../constants")
const { getTemplatesCtx } = require("../../../constants/templates")

exports.save = async ctx => {
  const db = getGlobalDB()
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
  const info = {}
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

exports.fetch = async ctx => {
  ctx.body = await getTemplatesCtx(ctx)
}

exports.fetchByType = async ctx => {
  ctx.body = await getTemplatesCtx(ctx, {
    type: ctx.params.type,
  })
}

exports.fetchByOwner = async ctx => {
  ctx.body = await getTemplatesCtx(ctx, {
    ownerId: ctx.params.ownerId,
  })
}

exports.find = async ctx => {
  ctx.body = await getTemplatesCtx(ctx, {
    id: ctx.params.id,
  })
}

exports.destroy = async ctx => {
  const db = getGlobalDB()
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.message = `Template ${ctx.params.id} deleted.`
  ctx.status = 200
}
