const { generateTemplateID, getTemplateParams, StaticDatabases } = require("@budibase/auth").db
const { CouchDB } = require("../../../db")
const { TemplatePurposePretty, TemplateTypes, EmailTemplatePurpose, TemplatePurpose } = require("../../../constants")
const { getTemplateByPurpose } = require("../../../constants/templates")

const GLOBAL_DB = StaticDatabases.GLOBAL.name
const GLOBAL_OWNER = "global"

function addBaseTemplates(templates, type = null) {
  let purposeList
  switch (type) {
    case TemplateTypes.EMAIL:
      purposeList = Object.values(EmailTemplatePurpose)
      break
    default:
      purposeList = Object.values(TemplatePurpose)
      break
  }
  for (let purpose of purposeList) {
    // check if a template exists already for purpose
    if (templates.find(template => template.purpose === purpose)) {
      continue
    }
    templates.push(getTemplateByPurpose(purpose))
  }
  return templates
}

async function getTemplates({ ownerId, type, id } = {}) {
  const db = new CouchDB(GLOBAL_DB)
  const response = await db.allDocs(
    getTemplateParams(ownerId, id, {
      include_docs: true,
    })
  )
  let templates = response.rows.map(row => row.doc)
  // should only be one template with ID
  if (id) {
    return templates[0]
  }
  if (type) {
    templates = templates.filter(template => template.type === type)
  }

  return addBaseTemplates(templates, type)
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
  const db = new CouchDB(GLOBAL_DB)
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.message = `Template ${ctx.params.id} deleted.`
  ctx.status = 200
}
