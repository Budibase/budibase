import { sendEmail as sendEmailFn } from "../../../utilities/email"
import { tenancy } from "@budibase/backend-core"
import {
  UserCtx,
  User,
  SendEmailRequest,
  SendEmailResponse,
} from "@budibase/types"

export async function sendEmail(
  ctx: UserCtx<SendEmailRequest, SendEmailResponse>
) {
  let {
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
  let user: User | undefined = undefined
  if (userId) {
    const db = tenancy.getGlobalDB()
    user = await db.tryGet<User>(userId)
    if (!user) {
      ctx.throw(404, "User not found.")
    }
  }
  const response = await sendEmailFn(email, purpose, {
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
