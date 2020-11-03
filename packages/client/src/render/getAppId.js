export const getAppIdFromPath = () => {
  let appId = location.pathname.split("/")[1]
  return appId.startsWith("app_") ? appId : undefined
}
