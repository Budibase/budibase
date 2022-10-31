import {
  CreateUserParams,
  User,
} from "@budibase/server/api/controllers/public/mapping/types"
import generator from "../../generator"

const generate = (overrides: Partial<User> = {}): CreateUserParams => ({
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
