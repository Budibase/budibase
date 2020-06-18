export const getAppId = cookie => {
  const base64Token = cookie
    .split(";")
    .find(c => c.trim().startsWith("budibase:token"))
    .split("=")[1]

  const user = JSON.parse(atob(base64Token.split(".")[1]))
  return user.appId
}
