const { readStaticFile } = require("../../utilities/fileSystem")
const {
  EmailTemplatePurpose,
  TemplateTypes,
  TemplatePurpose,
} = require("../index")
const { join } = require("path")
const CouchDB = require("../../db")
const { getTemplateParams, StaticDatabases } = require("@budibase/auth").db

const TEMPLATE_PATH = join(__dirname, "..", "constants", "templates")

exports.EmailTemplates = {
  [EmailTemplatePurpose.PASSWORD_RECOVERY]: readStaticFile(
    join(TEMPLATE_PATH, "passwordRecovery.html")
  ),
  [EmailTemplatePurpose.INVITATION]: readStaticFile(
    join(TEMPLATE_PATH, "invitation.html")
  ),
  [EmailTemplatePurpose.BASE]: readStaticFile(join(TEMPLATE_PATH, "base.html")),
  [EmailTemplatePurpose.STYLES]: readStaticFile(
    join(TEMPLATE_PATH, "style.css")
  ),
}

exports.addBaseTemplates = (templates, type = null) => {
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
    if (exports.EmailTemplates[purpose]) {
      templates.push(exports.EmailTemplates[purpose])
    }
  }
  return templates
}

exports.getTemplates = async ({ ownerId, type, id } = {}) => {
  const db = new CouchDB(StaticDatabases.GLOBAL.name)
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
  return exports.addBaseTemplates(templates, type)
}

exports.getTemplateByPurpose = async (type, purpose) => {
  const templates = await exports.getTemplates({ type })
  return templates.find(template => template.purpose === purpose)
}
