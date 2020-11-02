export const getAppIdFromPath = () => {
  return location.pathname.split("/")[1]
}
