import * as configs from "../configs"

// wrapper utility function
export const enabled = async () => {
  return configs.analyticsEnabled()
}
