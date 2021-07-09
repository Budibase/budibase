const nodemailer = require("nodemailer")
const CouchDB = require("../db")
const { StaticDatabases, getScopedConfig } = require("@budibase/auth").db
const { EmailTemplatePurpose, TemplateTypes, Configs } = require("../constants")
const { getTemplateByPurpose } = require("../constants/templates")
const { getSettingsTemplateContext } = require("./templates")
const { processString } = require("@budibase/string-templates")
const { getResetPasswordCode, getInviteCode } = require("../utilities/redis")

const TEST_MODE = false
const GLOBAL_DB = StaticDatabases.GLOBAL.name
const TYPE = TemplateTypes.EMAIL

const FULL_EMAIL_PURPOSES = [
  EmailTemplatePurpose.INVITATION,
  EmailTemplatePurpose.PASSWORD_RECOVERY,
  EmailTemplatePurpose.WELCOME,
  EmailTemplatePurpose.CUSTOM,
]

function createSMTPTransport(config) {
  let options
  let secure = config.secure
  // default it if not specified
  if (secure == null) {
    secure = config.port === 465
  }
  if (!TEST_MODE) {
    options = {
      port: config.port,
      host: config.host,
      secure: secure,
      auth: config.auth,
    }
    options.tls = {
      rejectUnauthorized: false,
    }
  } else {
    options = {
      port: 587,
      host: "smtp.ethereal.email",
      secure: false,
      auth: {
        user: "don.bahringer@ethereal.email",
        pass: "yCKSH8rWyUPbnhGYk9",
      },
    }
  }
  return nodemailer.createTransport(options)
}

async function getLinkCode(purpose, email, user, info = null) {
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      return getResetPasswordCode(user._id)
    case EmailTemplatePurpose.INVITATION:
      return getInviteCode(email, info)
    default:
      return null
  }
}

/**
 * Builds an email using handlebars and the templates found in the system (default or otherwise).
 * @param {string} purpose the purpose of the email being built, e.g. invitation, password reset.
 * @param {string} email the address which it is being sent to for contextual purposes.
 * @param {object} context the context which is being used for building the email (hbs context).
 * @param {object|null} user if being sent to an existing user then the object can be provided for context.
 * @param {string|null} contents if using a custom template can supply contents for context.
 * @return {Promise<string>} returns the built email HTML if all provided parameters were valid.
 */
async function buildEmail(purpose, email, context, { user, contents } = {}) {
  // this isn't a full email
  if (FULL_EMAIL_PURPOSES.indexOf(purpose) === -1) {
    throw `Unable to build an email of type ${purpose}`
  }
  let [base, body] = await Promise.all([
    getTemplateByPurpose(TYPE, EmailTemplatePurpose.BASE),
    getTemplateByPurpose(TYPE, purpose),
  ])
  if (!base || !body) {
    throw "Unable to build email, missing base components"
  }
  base = base.contents
  body = body.contents
  context = {
    ...context,
    contents,
    email,
    user: user || {},
  }

  body = await processString(body, context)
  // this should now be the complete email HTML
  return processString(base, {
    ...context,
    body,
  })
}

/**
 * Utility function for finding most valid SMTP configuration.
 * @param {object} db The CouchDB database which is to be looked up within.
 * @param {string|null} groupId If using finer grain control of configs a group can be used.
 * @return {Promise<object|null>} returns the SMTP configuration if it exists
 */
async function getSmtpConfiguration(db, groupId = null) {
  const params = {
    type: Configs.SMTP,
  }
  if (groupId) {
    params.group = groupId
  }
  return getScopedConfig(db, params)
}

/**
 * Checks if a SMTP config exists based on passed in parameters.
 * @param groupId
 * @return {Promise<boolean>} returns true if there is a configuration that can be used.
 */
exports.isEmailConfigured = async (groupId = null) => {
  // when "testing" simply return true
  if (TEST_MODE) {
    return true
  }
  const db = new CouchDB(GLOBAL_DB)
  const config = await getSmtpConfiguration(db, groupId)
  return config != null
}

/**
 * Given an email address and an email purpose this will retrieve the SMTP configuration and
 * send an email using it.
 * @param {string} email The email address to send to.
 * @param {string} purpose The purpose of the email being sent (e.g. reset password).
 * @param {string|undefined} groupId If finer grain controls being used then this will lookup config for group.
 * @param {object|undefined} user If sending to an existing user the object can be provided, this is used in the context.
 * @param {string|undefined} from If sending from an address that is not what is configured in the SMTP config.
 * @param {string|undefined} contents If sending a custom email then can supply contents which will be added to it.
 * @param {string|undefined} subject A custom subject can be specified if the config one is not desired.
 * @param {object|undefined} info Pass in a structure of information to be stored alongside the invitation.
 * @return {Promise<object>} returns details about the attempt to send email, e.g. if it is successful; based on
 * nodemailer response.
 */
exports.sendEmail = async (
  email,
  purpose,
  { groupId, user, from, contents, subject, info } = {}
) => {
  const db = new CouchDB(GLOBAL_DB)
  let config = (await getSmtpConfiguration(db, groupId)) || {}
  if (Object.keys(config).length === 0 && !TEST_MODE) {
    throw "Unable to find SMTP configuration."
  }
  const transport = createSMTPTransport(config)
  // if there is a link code needed this will retrieve it
  const code = await getLinkCode(purpose, email, user, info)
  const context = await getSettingsTemplateContext(purpose, code)
  const message = {
    from: from || config.from,
    to: email,
    html: await buildEmail(purpose, email, context, { user, contents }),
  }
  if (subject || config.subject) {
    message.subject = await processString(subject || config.subject, context)
  }
  const response = await transport.sendMail(message)
  if (TEST_MODE) {
    console.log("Test email URL: " + nodemailer.getTestMessageUrl(response))
  }
  return response
}

/**
 * Given an SMTP configuration this runs it through nodemailer to see if it is in fact functional.
 * @param {object} config an SMTP configuration - this is based on the nodemailer API.
 * @return {Promise<boolean>} returns true if the configuration is valid.
 */
exports.verifyConfig = async config => {
  const transport = createSMTPTransport(config)
  await transport.verify()
}
