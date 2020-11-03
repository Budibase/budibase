export const getAppIdFromPath = () => {
  let appId = location.pathname.split("/")[1]
  return appId && appId.startsWith("app_") ? appId : undefined
}
