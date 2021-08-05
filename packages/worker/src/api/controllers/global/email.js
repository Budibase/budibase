const { sendEmail } = require("../../../utilities/email")
const { getGlobalDB } = require("@budibase/auth/tenancy")

exports.sendEmail = async ctx => {
  let { workspaceId, email, userId, purpose, contents, from, subject } =
    ctx.request.body
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
  })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
