import { sdk as proSdk } from "@budibase/pro"

export const initPro = async () => {
  await proSdk.init({})
}
