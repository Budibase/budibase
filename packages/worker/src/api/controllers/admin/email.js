const { sendEmail } = require("../../../utilities/email")
const { getGlobalDBFromCtx } = require("@budibase/auth/db")

exports.sendEmail = async ctx => {
  let { tenantId, workspaceId, email, userId, purpose, contents, from, subject } =
    ctx.request.body
  let user
  if (userId) {
    const db = getGlobalDBFromCtx(ctx)
    user = await db.get(userId)
  }
  if (!tenantId && ctx.user.tenantId) {
    tenantId = ctx.user.tenantId
  }
  const response = await sendEmail(tenantId, email, purpose, {
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
