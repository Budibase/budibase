import { sdk as proSdk } from "@budibase/pro"
import * as userSdk from "./sdk/users"

export const initPro = async () => {
  await proSdk.init({
    scimUserServiceConfig: {
      functions: {
        saveUser: userSdk.db.save,
        removeUser: (id: string) => userSdk.db.destroy(id),
      },
    },
  })
}
