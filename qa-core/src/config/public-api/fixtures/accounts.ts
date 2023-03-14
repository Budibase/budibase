import { NewAccount } from "./types/newAccount"

import generator from "../../generator"
import { Hosting } from "@budibase/types"

export const generateAccount = (): Partial<NewAccount> => {
  const randomGuid = generator.guid()
  //Needs to start with a letter
  let tenant: string = "tenant" + randomGuid
  tenant = tenant.replace(/-/g, "")

  return {
    email: `qa+${randomGuid}@budibase.com`,
    hosting: Hosting.CLOUD,
    name: `qa+${randomGuid}@budibase.com`,
    password: `${randomGuid}`,
    profession: "software_engineer",
    size: "10+",
    tenantId: `${tenant}`,
    tenantName: `${tenant}`,
  }
}
