import * as pro from "@budibase/pro"
import { poc, License } from "@budibase/pro"

export const run = () => {
  if (process.env.PRO) {
    const license: License = { id: "123" }
    console.log(license)
    console.log(poc)
    console.log(pro)
    console.log("PRO")
  }
}
