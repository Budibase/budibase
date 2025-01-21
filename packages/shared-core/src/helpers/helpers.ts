import { User } from "@budibase/types"

/**
 * Gets a key within an object. The key supports dot syntax for retrieving deep
 * fields - e.g. "a.b.c".
 * Exact matches of keys with dots in them take precedence over nested keys of
 * the same path - e.g. getting "a.b" from { "a.b": "foo", a: { b: "bar" } }
 * will return "foo" over "bar".
 * @param obj the object
 * @param key the key
 * @return the value or null if a value was not found for this key
 */
export const deepGet = (obj: { [x: string]: any }, key: string) => {
  if (!obj || !key) {
    return null
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key]
  }
  const split = key.split(".")
  for (let i = 0; i < split.length; i++) {
    obj = obj?.[split[i]]
  }
  return obj
}

/**
 * Gets the initials to show in a user avatar.
 * @param user the user
 */
export const getUserInitials = (user: User) => {
  if (!user) {
    return "?"
  }
  let initials = ""
  initials += user.firstName ? user.firstName[0] : ""
  initials += user.lastName ? user.lastName[0] : ""
  if (initials !== "") {
    return initials
  }
  return user.email?.[0] || "U"
}

/**
 * Gets a deterministic colour for a particular user
 * @param user the user
 */
export const getUserColor = (user: User) => {
  let id = user?._id
  if (!id) {
    return "var(--spectrum-global-color-blue-400)"
  }

  // In order to generate the same color for global users as app users, we need
  // to remove the app-specific table prefix
  id = id.replace("ro_ta_users_", "")

  // Generate a hue based on the ID
  let hue = 1
  for (let i = 0; i < id.length; i++) {
    hue += id.charCodeAt(i)
    hue = hue % 36
  }
  return `hsl(${hue * 10}, 50%, 40%)`
}

/**
 * Gets a friendly label to describe who a user is.
 * @param user the user
 */
export const getUserLabel = (user: User) => {
  if (!user) {
    return ""
  }
  const { firstName, lastName, email } = user
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else {
    return email
  }
}

export function cancelableTimeout(
  timeout: number
): [Promise<unknown>, () => void] {
  let timeoutId: NodeJS.Timeout
  return [
    new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject({
          status: 301,
          errno: "ETIME",
        })
      }, timeout)
    }),
    () => {
      clearTimeout(timeoutId)
    },
  ]
}

export async function withTimeout<T>(
  timeout: number,
  promise: Promise<T>
): Promise<T> {
  const [timeoutPromise, cancel] = cancelableTimeout(timeout)
  const result = (await Promise.race([promise, timeoutPromise])) as T
  cancel()
  return result
}
