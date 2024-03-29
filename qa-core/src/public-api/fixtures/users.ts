import { CreateUserParams, User } from "../../types"
import { generator } from "../../shared"

export const generateUser = (
  overrides: Partial<User> = {}
): CreateUserParams => ({
  email: generator.email({ domain: "example.com" }),
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
