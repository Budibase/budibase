import { sdk as proSdk } from "@budibase/pro"

export const initPro = async () => {
  await proSdk.init({})
}

export const shutdownPro = async () => {
  await proSdk.shutdown()
}
