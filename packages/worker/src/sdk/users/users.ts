import { events, tenancy, users as usersCore } from "@budibase/backend-core"
import {
  EmailTemplatePurpose,
  InviteUserRequest,
  InviteUsersRequest,
  InviteUsersResponse,
  type SaveUserOpts,
  type SaveSSOUserFunction,
  type User,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"
import {
  getInitialUserGroups,
  recordGroupChanges,
  validateGroupChanges,
} from "./groups"

export const save = async ({
  user,
  options,
}: {
  user: User
  options?: SaveUserOpts
}) => {
  const previousUser = user._id
    ? await tenancy.getGlobalDB().tryGet<User>(user._id)
    : undefined
  if (!previousUser && options?.assignDefaultGroup !== false) {
    const userGroups = await getInitialUserGroups({
      userGroups: user.userGroups,
    })
    user = { ...user, ...(userGroups !== undefined && { userGroups }) }
  }
  const changes = await validateGroupChanges({
    userGroups: user.userGroups,
    previousGroups: previousUser?.userGroups,
  })
  const saved = await usersCore.UserDB.save(user, {
    ...options,
    assignDefaultGroup: false,
  })
  await recordGroupChanges({ changes, userIds: [saved._id!] })
  return saved
}

export const saveSSO: SaveSSOUserFunction = (user, options) =>
  save({ user, options })

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
    if (matchedEmails.includes(user.email.toLowerCase())) {
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
      await validateGroupChanges({ userGroups: user.userInfo?.userGroups })
      let userInfo = user.userInfo
      if (!userInfo) {
        userInfo = {}
      }
      userInfo.tenantId = tenantId
      const opts = {
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
