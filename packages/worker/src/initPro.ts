import { sdk as proSdk } from "@budibase/pro"
import * as userSdk from "./sdk/users"

export const initPro = async () => {
  await proSdk.init({})
}
