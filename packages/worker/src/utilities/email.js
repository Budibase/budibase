const nodemailer = require("nodemailer")
const CouchDB = require("../db")
const { StaticDatabases, determineScopedConfig } = require("@budibase/auth").db
const {
  EmailTemplatePurpose,
  TemplateTypes,
  Configs,
} = require("../constants")
const { getTemplateByPurpose } = require("../constants/templates")
const { getSettingsTemplateContext } = require("./templates")
const { processString } = require("@budibase/string-templates")

const GLOBAL_DB = StaticDatabases.GLOBAL.name
const TYPE = TemplateTypes.EMAIL

const FULL_EMAIL_PURPOSES = [
  EmailTemplatePurpose.INVITATION,
  EmailTemplatePurpose.PASSWORD_RECOVERY,
  EmailTemplatePurpose.WELCOME,
]

function createSMTPTransport(config) {
  const options = {
    port: config.port,
    host: config.host,
    secure: config.secure || false,
    auth: config.auth,
  }
  if (config.selfSigned) {
    options.tls = {
      rejectUnauthorized: false,
    }
  }
  return nodemailer.createTransport(options)
}

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
  if (!base || !styles || !body) {
    throw "Unable to build email, missing base components"
  }
  base = base.contents
  styles = styles.contents
  body = body.contents

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

exports.sendEmail = async (email, purpose, { groupId, userId }) => {
  const db = new CouchDB(GLOBAL_DB)
  const params = {
    type: Configs.SMTP,
  }
  if (groupId) {
    params.group = groupId
  }
  let user = {}
  if (userId) {
    user = db.get(userId)
  }
  const config = await determineScopedConfig(db, params)
  if (!config) {
    throw "Unable to find SMTP configuration"
  }
  const transport = createSMTPTransport(config)
  const message = {
    from: config.from,
    subject: config.subject,
    to: email,
    html: await buildEmail(purpose, email, user),
  }
  return transport.sendMail(message)
}


exports.verifyConfig = async config => {
  const transport = createSMTPTransport(config)
  await transport.verify()
}
