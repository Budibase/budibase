import { User } from "@budibase/types"
import { generator } from "./generator"
import { uuid } from "./common"
import { tenant } from "."

export const newEmail = () => {
  return `${uuid()}@test.com`
}

export const user = (userProps?: Partial<User>): User => {
  return {
    email: newEmail(),
    password: "test",
    roles: { app_test: "admin" },
    firstName: generator.first(),
    lastName: generator.last(),
    pictureUrl: "http://test.com",
    tenantId: tenant.id(),
    ...userProps,
  }
}
