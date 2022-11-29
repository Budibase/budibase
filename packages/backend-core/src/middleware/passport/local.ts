import { UserStatus } from "../../constants"
import { compare, newid } from "../../utils"
import env from "../../environment"
import * as users from "../../users"
import { authError } from "./utils"
import { createASession } from "../../security/sessions"
import { getTenantId } from "../../tenancy"
import { BBContext } from "@budibase/types"
const jwt = require("jsonwebtoken")

const INVALID_ERR = "Invalid credentials"
const SSO_NO_PASSWORD = "SSO user does not have a password set"
const EXPIRED = "This account has expired. Please reset your password"

export const options = {
  passReqToCallback: true,
}

/**
 * Passport Local Authentication Middleware.
 * @param {*} ctx the request structure
 * @param {*} email username to login with
 * @param {*} password plain text password to log in with
 * @param {*} done callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
export async function authenticate(
  ctx: BBContext,
  email: string,
  password: string,
  done: Function
) {
  if (!email) return authError(done, "Email Required")
  if (!password) return authError(done, "Password Required")

  const dbUser = await users.getGlobalUserByEmail(email)
  if (dbUser == null) {
    return authError(done, `User not found: [${email}]`)
  }

  // check that the user is currently inactive, if this is the case throw invalid
  if (dbUser.status === UserStatus.INACTIVE) {
    return authError(done, INVALID_ERR)
  }

  // check that the user has a stored password before proceeding
  if (!dbUser.password) {
    if (
      (dbUser.account && dbUser.account.authType === "sso") || // root account sso
      dbUser.thirdPartyProfile // internal sso
    ) {
      return authError(done, SSO_NO_PASSWORD)
    }

    console.error("Non SSO usser has no password set", dbUser)
    return authError(done, EXPIRED)
  }

  // authenticate
  if (await compare(password, dbUser.password)) {
    const sessionId = newid()
    const tenantId = getTenantId()

    await createASession(dbUser._id!, { sessionId, tenantId })

    const token = jwt.sign(
      {
        userId: dbUser._id,
        sessionId,
        tenantId,
      },
      env.JWT_SECRET
    )
    // Remove users password in payload
    delete dbUser.password

    return done(null, {
      ...dbUser,
      token,
    })
  } else {
    return authError(done, INVALID_ERR)
  }
}
