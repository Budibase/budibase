const CouchDB = require("../../../db")
const { StaticDatabases, determineScopedConfig } = require("@budibase/auth").db
const {
  EmailTemplatePurpose,
  TemplateTypes,
  Configs,
} = require("../../../constants")
const { getTemplateByPurpose } = require("../../../constants/templates")
const { getSettingsTemplateContext } = require("../../../utilities/templates")
const { processString } = require("@budibase/string-templates")
const { createSMTPTransport } = require("../../../utilities/email")

const GLOBAL_DB = StaticDatabases.GLOBAL.name
const TYPE = TemplateTypes.EMAIL

const FULL_EMAIL_PURPOSES = [
  EmailTemplatePurpose.INVITATION,
  EmailTemplatePurpose.PASSWORD_RECOVERY,
]

async function buildEmail(purpose, email, user) {
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
    user: user || {},
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
  const { groupId, email, userId, purpose } = ctx.request.body
  const db = new CouchDB(GLOBAL_DB)
  const params = {}
  if (groupId) {
    params.group = groupId
  }
  params.type = Configs.SMTP
  let user = {}
  if (userId) {
    user = db.get(userId)
  }
  const config = await determineScopedConfig(db, params)
  const transport = createSMTPTransport(config)
  const message = {
    from: config.from,
    subject: config.subject,
    to: email,
    html: await buildEmail(purpose, email, user),
  }
  await transport.sendMail(message)
}
