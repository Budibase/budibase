const CouchDB = require("../../../db")
const { StaticDatabases, determineScopedConfig } = require("@budibase/auth").db
const { EmailTemplatePurpose, TemplateTypes, Configs } = require("../../../constants")
const { getTemplateByPurpose } = require("../../../constants/templates")
const { getSettingsTemplateContext } = require("../../../utilities/templates")
const { processString } = require("@budibase/string-templates")
const nodemailer = require("nodemailer")

const GLOBAL_DB = StaticDatabases.GLOBAL.name
const TYPE = TemplateTypes.EMAIL

const FULL_EMAIL_PURPOSES = [
  EmailTemplatePurpose.INVITATION,
  EmailTemplatePurpose.PASSWORD_RECOVERY,
]

function createSMTPTransport(config) {
  const transport = nodemailer.createTransport({
    port: config.port,
    host: config.host,

  })
}

exports.buildEmail = async (email, user, purpose) => {
  // this isn't a full email
  if (FULL_EMAIL_PURPOSES.indexOf(purpose) === -1) {
    throw `Unable to build an email of type ${purpose}`
  }
  let [base, styles, body] = await Promise.all([
    getTemplateByPurpose(TYPE, EmailTemplatePurpose.BASE),
    getTemplateByPurpose(TYPE, EmailTemplatePurpose.STYLES),
    getTemplateByPurpose(TYPE, purpose),
  ])

  // TODO: need to extend the context as much as possible
  const context = {
    ...(await getSettingsTemplateContext()),
    email,
    user,
  }

  body = await processString(body, context)
  styles = await processString(styles, context)
  // this should now be the complete email HTML
  return processString(base, {
    ...context,
    styles,
    body,
  })
}

exports.sendEmail = async ctx => {
  const { groupId, email, purpose } = ctx.request.body
  const db = new CouchDB(GLOBAL_DB)
  const params = {}
  if (groupId) {
    params.group = groupId
  }
  params.type = Configs.SMTP
  const config = await determineScopedConfig(db, params)
  const transport = createSMTPTransport(config)
}

