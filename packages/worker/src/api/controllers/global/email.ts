import { sendEmail as sendEmailFn } from "../../../utilities/email"
import { tenancy } from "@budibase/backend-core"
import { BBContext, User } from "@budibase/types"

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
  })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
