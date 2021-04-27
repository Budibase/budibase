const { sendEmail } = require("../../../utilities/email")

exports.sendEmail = async ctx => {
  const { groupId, email, userId, purpose } = ctx.request.body
  const response = await sendEmail(email, purpose, { groupId, userId })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
