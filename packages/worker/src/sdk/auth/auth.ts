import {
  auth as authCore,
  env as coreEnv,
  events,
  HTTPError,
  sessions,
  tenancy,
  utils as coreUtils,
  cache,
} from "@budibase/backend-core"
import { PlatformLogoutOpts, User, EmailTemplatePurpose } from "@budibase/types"
import jwt from "jsonwebtoken"
import * as userSdk from "../users"
import * as emails from "../../utilities/email"

// LOGIN / LOGOUT

export async function loginUser(user: User) {
  const sessionId = coreUtils.newid()
  const tenantId = tenancy.getTenantId()
  await sessions.createASession(user._id!, {
    sessionId,
    tenantId,
    email: user.email,
  })
  return jwt.sign(
    {
      userId: user._id,
      sessionId,
      tenantId,
      email: user.email,
    },
    coreEnv.JWT_SECRET!
  )
}

export async function logout(opts: PlatformLogoutOpts) {
  // TODO: This should be moved out of core and into worker only
  // account-portal can call worker endpoint
  return authCore.platformLogout(opts)
}

// PASSWORD MANAGEMENT

/**
 * Reset the user password, used as part of a forgotten password flow.
 */
export const reset = async (email: string) => {
  const configured = await emails.isEmailConfigured()
  if (!configured) {
    throw new HTTPError(
      "Please contact your platform administrator, SMTP is not configured.",
      400
    )
  }

  const user = await userSdk.core.getGlobalUserByEmail(email)
  // exit if user doesn't exist
  if (!user) {
    return
  }

  // exit if user has sso
  if (await userSdk.db.isPreventPasswordActions(user)) {
    return
  }

  // send password reset
  await emails.sendEmail(email, EmailTemplatePurpose.PASSWORD_RECOVERY, {
    user,
    subject: "{{ company }} platform password reset",
  })
  await events.user.passwordResetRequested(user)
}

/**
 * Perform the user password update if the provided reset code is valid.
 */
export const resetUpdate = async (resetCode: string, password: string) => {
  const { userId } = await cache.passwordReset.getCode(resetCode)

  let user = await userSdk.db.getUser(userId)
  user.password = password
  user = await userSdk.db.save(user)

  await cache.passwordReset.invalidateCode(resetCode)
  await sessions.invalidateSessions(userId)

  // remove password from the user before sending events
  delete user.password
  await events.user.passwordReset(user)
}
