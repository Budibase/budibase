import { UserStatus } from "../../constants"
import { compare } from "../../utils"
import * as users from "../../users"
import { authError } from "./utils"
import { Ctx } from "@budibase/types"

const INVALID_ERR = "Invalid credentials"
const EXPIRED = "This account has expired. Please reset your password"

export const options = {
  passReqToCallback: true,
}

/**
 * Passport Local Authentication Middleware.
 * @param ctx the request structure
 * @param email username to login with
 * @param password plain text password to log in with
 * @param done callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
export async function authenticate(
  ctx: Ctx,
  email: string,
  password: string,
  done: Function
) {
  if (!email) return authError(done, "Email Required")
  if (!password) return authError(done, "Password Required")

  const dbUser = await users.getGlobalUserByEmail(email)
  if (dbUser == null) {
    console.info(`user=${email} could not be found`)
    return authError(done, INVALID_ERR)
  }

  if (dbUser.status === UserStatus.INACTIVE) {
    console.info(`user=${email} is inactive`, dbUser)
    return authError(done, INVALID_ERR)
  }

  if (!dbUser.password) {
    console.info(`user=${email} has no password set`, dbUser)
    return authError(done, EXPIRED)
  }

  if (!(await compare(password, dbUser.password))) {
    return authError(done, INVALID_ERR)
  }

  // intentionally remove the users password in payload
  delete dbUser.password
  return done(null, dbUser)
}
