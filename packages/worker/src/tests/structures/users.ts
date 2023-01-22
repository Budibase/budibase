export const email = "test@test.com"
import { AdminUser, BuilderUser, User } from "@budibase/types"
import { v4 as uuid } from "uuid"

export const newEmail = () => {
  return `${uuid()}@test.com`
}

export const user = (userProps?: any): User => {
  return {
    email: newEmail(),
    password: "test",
    roles: { app_test: "admin" },
    ...userProps,
  }
}

export const adminUser = (userProps?: any): AdminUser => {
  return {
    ...user(userProps),
    admin: {
      global: true,
    },
    builder: {
      global: true,
    },
  }
}

export const builderUser = (userProps?: any): BuilderUser => {
  return {
    ...user(userProps),
    builder: {
      global: true,
    },
  }
}
