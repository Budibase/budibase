import { object } from "./utils"
import Resource from "./utils/Resource"

const userGroup = object(
  {
    _id: {
      description: "The group ID to use in a user's userGroups array.",
      type: "string",
    },
    name: {
      description: "The group's name.",
      type: "string",
    },
    isDefault: {
      description:
        "Whether new users are automatically assigned to this group.",
      type: "boolean",
    },
    managedByScim: {
      description:
        "Whether the group is managed by SCIM. Memberships in these groups cannot be changed through the public user API.",
      type: "boolean",
    },
  },
  { required: ["_id", "name", "isDefault", "managedByScim"] }
)

export default new Resource()
  .setExamples({
    userGroups: {
      value: {
        data: [
          {
            _id: "gr_engineering",
            name: "Engineering",
            isDefault: false,
            managedByScim: false,
          },
        ],
      },
    },
  })
  .setSchemas({
    userGroupList: object({
      data: { type: "array", items: userGroup },
    }),
  })
