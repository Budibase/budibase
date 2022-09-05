import generator from "../../generator"

const generate = (overrides = {}) => ({
  name: generator.word(),
  url: `/${generator.word()}`,
  ...overrides
}) 

export default generate