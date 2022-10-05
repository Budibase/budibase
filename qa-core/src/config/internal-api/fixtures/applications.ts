import generator from "../../generator"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"

const generate = (
  overrides: Partial<Application> = {}
): Partial<Application> => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides,
})

export default generate
