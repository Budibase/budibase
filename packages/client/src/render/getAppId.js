export const parseAppIdFromCookie = docCookie => {
  const cookie =
    docCookie.split(";").find(c => c.trim().startsWith("budibase:token")) ||
    docCookie.split(";").find(c => c.trim().startsWith("builder:token"))

  if (!cookie) return location.pathname.replace("/")

  const base64Token = cookie.substring(lengthOfKey)

  const user = JSON.parse(atob(base64Token.split(".")[1]))
  return user.appId
}

const lengthOfKey = "budibase:token=".length
