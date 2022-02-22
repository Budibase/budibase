const { object } = require("./utils")
const Resource = require("./utils/Resource")

const user = {
  _id: "us_693a73206518477283a8d5ae31103252",
  email: "test@test.com",
  roles: {
    app_957b12f943d348faa61db7e18e088d0f: "BASIC",
  },
  builder: {
    global: false,
  },
  admin: {
    global: true,
  },
  tenantId: "default",
  status: "active",
  budibaseAccess: true,
  csrfToken: "9c70291d-7137-48f9-9166-99ab5473a3d4",
  userId: "us_693a73206518477283a8d5ae31103252",
  roleId: "ADMIN",
  role: {
    _id: "ADMIN",
    name: "Admin",
    permissionId: "admin",
    inherits: "POWER",
  },
}

const userSchema = object({})

module.exports = new Resource()
  .setExamples({
    user: {
      value: {
        user: user,
      },
    },
    users: {
      value: {
        users: [user],
      },
    },
  })
  .setSchemas({
    user: userSchema,
    userOutput: object({
      user: userSchema,
    }),
  })
