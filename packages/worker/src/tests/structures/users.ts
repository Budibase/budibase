export const email = "test@test.com"

export const user = (userProps: any) => {
  return {
    email: "test@test.com",
    password: "test",
    roles: {},
    ...userProps,
  }
}

export const adminUser = (userProps: any) => {
  return {
    ...user(userProps),
    admin: {
      global: true,
    },
  }
}

export const builderUser = (userProps: any) => {
  return {
    ...user(userProps),
    builder: {
      global: true,
    },
  }
}
