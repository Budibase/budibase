import * as pro from "@budibase/pro"

export const run = () => {
  if (process.env.PRO) {
    console.log(pro)
  }
}
