import env from "../environment"
import { EmailTemplatePurpose, TemplateType } from "../constants"
import { getTemplateByPurpose, EmailTemplates } from "../constants/templates"
import { getSettingsTemplateContext } from "./templates"
import { processString } from "@budibase/string-templates"
import { getResetPasswordCode, getInviteCode } from "./redis"
import { User, SendEmailOpts, SMTPInnerConfig } from "@budibase/types"
import { configs } from "@budibase/backend-core"
import ical from "ical-generator"
const nodemailer = require("nodemailer")

const TEST_MODE = env.ENABLE_EMAIL_TEST_MODE && env.isDev()
const TYPE = TemplateType.EMAIL

const FULL_EMAIL_PURPOSES = [
  EmailTemplatePurpose.INVITATION,
  EmailTemplatePurpose.PASSWORD_RECOVERY,
  EmailTemplatePurpose.WELCOME,
  EmailTemplatePurpose.CUSTOM,
]

function createSMTPTransport(config?: SMTPInnerConfig) {
  let options: any
  let secure = config?.secure
  // default it if not specified
  if (secure == null) {
    secure = config?.port === 465
  }
  if (!TEST_MODE) {
    options = {
      port: config?.port,
      host: config?.host,
      secure: secure,
      auth: config?.auth,
    }
    options.tls = {
      rejectUnauthorized: false,
    }
    if (config?.connectionTimeout) {
      options.connectionTimeout = config.connectionTimeout
    }
  } else {
    options = {
      port: 587,
      host: "smtp.ethereal.email",
      secure: false,
      auth: {
        user: "seamus99@ethereal.email",
        pass: "5ghVteZAqj6jkKJF9R",
      },
    }
  }
  return nodemailer.createTransport(options)
}

async function getLinkCode(
  purpose: EmailTemplatePurpose,
  email: string,
  user: User,
  info: any = null
) {
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      return getResetPasswordCode(user._id!, info)
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
async function buildEmail(
  purpose: EmailTemplatePurpose,
  email: string,
  context: any,
  { user, contents }: any = {}
) {
  // this isn't a full email
  if (FULL_EMAIL_PURPOSES.indexOf(purpose) === -1) {
    throw `Unable to build an email of type ${purpose}`
  }
  let [base, body] = await Promise.all([
    getTemplateByPurpose(TYPE, EmailTemplatePurpose.BASE),
    getTemplateByPurpose(TYPE, purpose),
  ])

  // Change from branding to core
  let core = EmailTemplates[EmailTemplatePurpose.CORE]

  if (!base || !body || !core) {
    throw "Unable to build email, missing base components"
  }
  base = base.contents
  body = body.contents

  let name = user ? user.name : undefined
  if (user && !name && user.firstName) {
    name = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName
  }
  context = {
    ...context,
    contents,
    email,
    name,
    user: user || {},
  }

  // Prepend the core template
  const fullBody = core + body

  body = await processString(fullBody, context)

  // this should now be the core email HTML
  return processString(base, {
    ...context,
    body,
  })
}

/**
 * Checks if a SMTP config exists based on passed in parameters.
 * @return {Promise<boolean>} returns true if there is a configuration that can be used.
 */
export async function isEmailConfigured() {
  // when "testing" or smtp fallback is enabled simply return true
  if (TEST_MODE || env.SMTP_FALLBACK_ENABLED) {
    return true
  }
  const config = await configs.getSMTPConfig()
  return config != null
}

/**
 * Given an email address and an email purpose this will retrieve the SMTP configuration and
 * send an email using it.
 * @param {string} email The email address to send to.
 * @param {string} purpose The purpose of the email being sent (e.g. reset password).
 * @param {object} opts The options for sending the email.
 * @return {Promise<object>} returns details about the attempt to send email, e.g. if it is successful; based on
 * nodemailer response.
 */
export async function sendEmail(
  email: string,
  purpose: EmailTemplatePurpose,
  opts: SendEmailOpts
) {
  const config = await configs.getSMTPConfig(opts?.automation)
  if (!config && !TEST_MODE) {
    throw "Unable to find SMTP configuration."
  }
  const transport = createSMTPTransport(config)
  // if there is a link code needed this will retrieve it
  const code = await getLinkCode(purpose, email, opts.user, opts?.info)
  let context = await getSettingsTemplateContext(purpose, code)

  let message: any = {
    from: opts?.from || config?.from,
    html: await buildEmail(purpose, email, context, {
      user: opts?.user,
      contents: opts?.contents,
    }),
  }

  message = {
    ...message,
    to: email,
    cc: opts?.cc,
    bcc: opts?.bcc,
  }

  if (opts?.subject || config?.subject) {
    message.subject = await processString(
      (opts?.subject || config?.subject) as string,
      context
    )
  }
  if (opts?.invite) {
    const calendar = ical({
      name: "Invite",
    })
    calendar.createEvent({
      start: opts.invite.startTime,
      end: opts.invite.endTime,
      summary: opts.invite.summary,
      location: opts.invite.location,
      url: opts.invite.url,
    })
    message = {
      ...message,
      icalEvent: {
        method: "request",
        content: calendar.toString(),
      },
    }
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
export async function verifyConfig(config: SMTPInnerConfig) {
  const transport = createSMTPTransport(config)
  await transport.verify()
}
