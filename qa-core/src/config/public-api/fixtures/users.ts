import { CreateUserParams } from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import generator from "../TestConfiguration/generator"

const generate = (overrides = {}): CreateUserParams => ({
  email: generator.email(),
  roles: {
    [generator.string({ length: 32, alpha: true, numeric: true })]:
      generator.word(),
  },
  password: generator.word(),
  status: "active",
  forceResetPassword: generator.bool(),
  builder: {
    global: generator.bool(),
  },
  admin: {
    global: generator.bool(),
  },
  ...overrides,
})

export default generate
