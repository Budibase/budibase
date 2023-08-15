import { object } from "./utils"
import Resource from "./utils/Resource"

const roleSchema = object(
  {
    appBuilder: object({
      appId: {
        description:
          "The app that the users should have app builder privileges granted for.",
        type: "string",
      },
    }),
    builder: object(
      {
        global: {
          type: "boolean",
        },
      },
      {
        description:
          "Add/remove global builder permissions from the list of users.",
      }
    ),
    admin: object(
      {
        global: {
          type: "boolean",
        },
      },
      {
        description:
          "Add/remove global admin permissions from the list of users.",
      }
    ),
    role: object(
      {
        roleId: {
          description: "The role ID, such as BASIC, ADMIN or a custom role ID.",
          type: "string",
        },
        appId: {
          description: "The app that the role relates to.",
          type: "string",
        },
      },
      { description: "Add/remove a per-app role, such as BASIC, ADMIN etc." }
    ),
    userIds: {
      description:
        "The user IDs to be updated to add/remove the specified roles.",
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  { required: ["userIds"] }
)

export default new Resource().setSchemas({
  rolesAssign: roleSchema,
  rolesUnAssign: roleSchema,
  rolesOutput: object({
    userIds: {
      description: "The updated users' IDs",
      type: "array",
      items: {
        type: "string",
      },
    },
  }),
})
