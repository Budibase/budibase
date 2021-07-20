const { generateTemplateID, StaticDatabases } = require("@budibase/auth").db
const CouchDB = require("../../../db")
const {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} = require("../../../constants")
const { getTemplates } = require("../../../constants/templates")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
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
  ctx.body = await getTemplates()
}

exports.fetchByType = async ctx => {
  ctx.body = await getTemplates({
    type: ctx.params.type,
  })
}

exports.fetchByOwner = async ctx => {
  ctx.body = await getTemplates({
    ownerId: ctx.params.ownerId,
  })
}

exports.find = async ctx => {
  ctx.body = await getTemplates({
    id: ctx.params.id,
  })
}

exports.destroy = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.message = `Template ${ctx.params.id} deleted.`
  ctx.status = 200
}
