import generator from "../TestConfiguration/generator"
import { CreateApplicationParams } from "../../../../../packages/server/src/api/controllers/public/mapping/types"

const generate = (overrides = {}): CreateApplicationParams => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides,
})

export default generate
