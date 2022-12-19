import generator from "../../generator"
import { Application } from "@budibase/server/api/controllers/public/mapping/types"

const generate = (
  overrides: Partial<Application> = {}
): Partial<Application> => ({
  name: generator.word() + generator.hash(),
  url: `/${generator.word() + generator.hash()}`,
  ...overrides,
})

export default generate
