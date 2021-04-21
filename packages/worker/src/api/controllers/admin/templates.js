const { generateTemplateID, getTemplateParams, StaticDatabases } = require("@budibase/auth").db
const { CouchDB } = require("../../../db")
const { TemplatePurposePretty } = require("../../../constants")

const GLOBAL_DB = StaticDatabases.GLOBAL.name
const GLOBAL_OWNER = "global"

async function getTemplates({ ownerId, type, id } = {}) {
  const db = new CouchDB(GLOBAL_DB)
  const response = await db.allDocs(
    getTemplateParams(ownerId, id, {
      include_docs: true,
    })
  )
  let templates = response.rows.map(row => row.doc)
  if (type) {
    templates = templates.filter(template => template.type === type)
  }
  return templates
}

exports.save = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const type = ctx.params.type
  let template = ctx.request.body
  if (!template.ownerId) {
    template.ownerId = GLOBAL_OWNER
  }
  if (!template._id) {
    template._id = generateTemplateID(template.ownerId)
  }

  const response = await db.put({
    ...template,
    type,
  })
  ctx.body = {
    ...template,
    _rev: response.rev,
  }
}

exports.definitions = async ctx => {
  ctx.body = {
    purpose: TemplatePurposePretty
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
  // TODO
  const db = new CouchDB(GLOBAL_DB)
  ctx.body = {}
}
