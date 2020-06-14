export const getAppId = cookie =>
  cookie
    .split(";")
    .find(c => c.trim().startsWith("budibase:appid"))
    .split("=")[1]
