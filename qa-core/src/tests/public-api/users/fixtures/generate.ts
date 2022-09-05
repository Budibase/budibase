import generator from "../../generator"
import { User } from "@budibase/types"

const generate = (overrides = {}): User => ({
  tenantId: generator.word(),
  email: generator.email(),
  roles: {
    [generator.string({ length: 32, alpha: true, numeric: true })]: generator.word(),
  },
  password: generator.word(),
  status: "active",
  forceResetPassword: generator.bool(),
  builder: {
    global: generator.bool()
  },
  admin: {
    global: generator.bool()
  },
  ...overrides
}) 

export default generate