export const email = "test@test.com"
import { AdminUser, BuilderUser, User } from "@budibase/types"

export const user = (userProps: any): User => {
  return {
    email: "test@test.com",
    password: "test",
    roles: {},
    ...userProps,
  }
}

export const adminUser = (userProps: any): AdminUser => {
  return {
    ...user(userProps),
    admin: {
      global: true,
    },
    builder: {
      global: true
    }
  }
}

export const builderUser = (userProps: any): BuilderUser => {
  return {
    ...user(userProps),
    builder: {
      global: true,
    },
  }
}
