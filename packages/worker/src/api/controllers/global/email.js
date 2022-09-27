const { sendEmail } = require("../../../utilities/email")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")

exports.sendEmail = async ctx => {
  let {
    workspaceId,
    email,
    userId,
    purpose,
    contents,
    from,
    subject,
    cc,
    bcc,
    automation,
  } = ctx.request.body
  let user
  if (userId) {
    const db = getGlobalDB()
    user = await db.get(userId)
  }
  const response = await sendEmail(email, purpose, {
    workspaceId,
    user,
    contents,
    from,
    subject,
    cc,
    bcc,
    automation,
  })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
