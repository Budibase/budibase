import { generator } from "../../shared"
import { User } from "@budibase/types"

const generateDeveloper = (): Partial<User> => {
  const randomId = generator.guid()
  return {
    email: `${randomId}@budibase.com`,
    password: randomId,
    roles: {},
    forceResetPassword: true,
    builder: {
      global: true,
    },
  }
}

const generateAdmin = (): Partial<User> => {
  const randomId = generator.guid()
  return {
    email: `${randomId}@budibase.com`,
    password: randomId,
    roles: {},
    forceResetPassword: true,
    admin: {
      global: true,
    },
    builder: {
      global: true,
    },
  }
}
const generateAppUser = (): Partial<User> => {
  const randomId = generator.guid()
  return {
    email: `${randomId}@budibase.com`,
    password: randomId,
    roles: {},
    forceResetPassword: true,
    admin: {
      global: false,
    },
    builder: {
      global: false,
    },
  }
}

export const generateInviteUser = (): Object[] => {
  const randomId = generator.guid()
  return [
    {
      email: `${randomId}@budibase.com`,
      userInfo: {
        userGroups: [],
      },
    },
  ]
}

export const generateUser = (
  amount: number = 1,
  role?: string
): Partial<User>[] => {
  const userList: Partial<User>[] = []
  for (let i = 0; i < amount; i++) {
    switch (role) {
      case "admin":
        userList.push(generateAdmin())
        break
      case "developer":
        userList.push(generateDeveloper())
        break
      case "appUser":
        userList.push(generateAppUser())
        break
      default:
        userList.push(generateAppUser())
        break
    }
  }
  return userList
}
