export const getAppId = () =>
  document.cookie
    .split(";")
    .find(c => c.trim().startsWith("budibase:appid"))
    .split("=")[1]
