import generator from "../../generator"
// import {
//   Application,
//   CreateApplicationParams,
// } from "@budibase/server/api/controllers/public/mapping/types"

const generate = (overrides: any = {}): any => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides,
})

export default generate
