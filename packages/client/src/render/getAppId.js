export const getAppId = cookie => {
  const base64Token = cookie
    .split(";")
    .find(c => c.trim().startsWith("budibase:token"))
    .substring(lengthOfKey)

  const user = JSON.parse(atob(base64Token.split(".")[1]))
  return user.appId
}

const lengthOfKey = "budibase:token=".length
