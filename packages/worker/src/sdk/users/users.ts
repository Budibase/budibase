import { events, tenancy, users as usersCore } from "@budibase/backend-core"
import {
  InviteUserRequest,
  InviteUsersRequest,
  InviteUsersResponse,
  EmailTemplatePurpose,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"

export async function invite(
  users: InviteUsersRequest
): Promise<InviteUsersResponse> {
  const response: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }

  const matchedEmails = await usersCore.searchExistingEmails(
    users.map(u => u.email)
  )
  const newUsers: InviteUserRequest[] = []

  // separate duplicates from new users
  for (let user of users) {
    if (matchedEmails.includes(user.email)) {
      // This "Unavailable" is load bearing. The tests and frontend both check for it
      // specifically
      response.unsuccessful.push({ email: user.email, reason: "Unavailable" })
    } else {
      newUsers.push(user)
    }
  }
  // overwrite users with new only
  users = newUsers

  // send the emails for new users
  const tenantId = tenancy.getTenantId()
  for (let user of users) {
    try {
      let userInfo = user.userInfo
      if (!userInfo) {
        userInfo = {}
      }
      userInfo.tenantId = tenantId
      const opts: any = {
        subject: "{{ company }} platform invitation",
        info: userInfo,
      }
      await sendEmail(user.email, EmailTemplatePurpose.INVITATION, opts)
      response.successful.push({ email: user.email })
      await events.user.invited(user.email)
    } catch (e) {
      console.error(`Failed to send email invitation email=${user.email}`, e)
      response.unsuccessful.push({
        email: user.email,
        reason: "Failed to send email",
      })
    }
  }

  return response
}
