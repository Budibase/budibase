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
