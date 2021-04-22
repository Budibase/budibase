const { EmailTemplatePurpose, TemplateTypes } = require("../constants")
const { getTemplateByPurpose } = require("../constants/templates")
const { processString } = require("@budibase/string-templates")
const { getSettingsTemplateContext } = require("./templates")

const TYPE = TemplateTypes.EMAIL

const FULL_EMAIL_PURPOSES = [EmailTemplatePurpose.INVITATION, EmailTemplatePurpose.PASSWORD_RECOVERY]

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
    ...await getSettingsTemplateContext(),
    email,
    user
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