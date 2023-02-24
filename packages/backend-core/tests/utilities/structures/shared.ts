import { User } from "@budibase/types"
import { generator } from "./generator"
import { uuid } from "./common"

export const newEmail = () => {
  return `${uuid()}@test.com`
}

export const user = (userProps?: any): User => {
  return {
    email: newEmail(),
    password: "test",
    roles: { app_test: "admin" },
    firstName: generator.first(),
    lastName: generator.last(),
    pictureUrl: "http://test.com",
    ...userProps,
  }
}
