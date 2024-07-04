import { tenancy } from "@budibase/backend-core"
import { BBContext, User } from "@budibase/types"
import { sendEmail as sendEmailFn } from "../../../utilities/email"

export async function sendEmail(ctx: BBContext) {
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
    invite,
    attachments,
  } = ctx.request.body
  let user: any
  if (userId) {
    const db = tenancy.getGlobalDB()
    user = await db.get<User>(userId)
  }
  const response = await sendEmailFn(email, purpose, {
    workspaceId,
    user,
    contents,
    from,
    subject,
    cc,
    bcc,
    automation,
    invite,
    attachments,
  })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
