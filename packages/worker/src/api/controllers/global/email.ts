import { sendEmail as sendEmailFn } from "../../../utilities/email"
import { tenancy } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"

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
  } = ctx.request.body
  let user
  if (userId) {
    const db = tenancy.getGlobalDB()
    user = await db.get(userId)
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
  })
  ctx.body = {
    ...response,
    message: `Email sent to ${email}.`,
  }
}
