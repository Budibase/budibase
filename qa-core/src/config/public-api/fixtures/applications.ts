import generator from "../TestConfiguration/generator"
import {
  Application,
  CreateApplicationParams,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"

const generate = (
  overrides: Partial<Application> = {}
): CreateApplicationParams => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides,
})

export default generate
