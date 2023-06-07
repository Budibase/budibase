import { generator } from "../../shared"
import { Hosting, CreateAccountRequest } from "@budibase/types"

export const generateAccount = (): CreateAccountRequest => {
  const uuid = generator.guid()

  const email = `qa+${uuid}@budibase.com`
  const tenant = `tenant${uuid.replace(/-/g, "")}`

  return {
    email,
    hosting: Hosting.CLOUD,
    name: email,
    password: uuid,
    profession: "software_engineer",
    size: "10+",
    tenantId: tenant,
    tenantName: tenant,
  }
}
