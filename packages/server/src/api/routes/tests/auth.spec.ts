import * as setup from "./utilities"
import {
  generateUserMetadataID,
  getGlobalIDFromUserMetadataID,
  InternalTables,
} from "../../../db/utils"
import { roles } from "@budibase/backend-core"
import { PermissionLevel, BuiltinPermissionID } from "@budibase/types"

describe("/authenticate", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch self", () => {
    it("should be able to fetch self", async () => {
      const res = await request
        .get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(generateUserMetadataID(config.getUser()._id))
    })

    it("should container the global user ID", async () => {
      const res = await request
        .get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.globalId).toEqual(
        getGlobalIDFromUserMetadataID(config.getUser()._id)
      )
    })

    it("should return correct roleId for custom role user when Users table has higher permissions", async () => {
      // Create a custom role
      const customRole = await config.createRole({
        name: "MyCustomRole",
        permissionId: BuiltinPermissionID.READ_ONLY,
        inherits: roles.BUILTIN_ROLE_IDS.BASIC,
      })

      // Create a user with the custom role
      const email = "customroleuser@example.com"
      const user = await config.createUser({
        email,
        roles: {
          [config.getProdWorkspaceId()]: customRole._id!,
        },
        builder: { global: false },
        admin: { global: false },
      })

      // Set the Users table permissions to ADMIN (higher than custom role)
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        resourceId: InternalTables.USER_METADATA,
        level: PermissionLevel.READ,
      })

      // Fetch self as the custom role user
      await config.withUser(user, async () => {
        const res = await request
          .get(`/api/self`)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)

        // Verify that the roleId is the custom role, not PUBLIC
        expect(res.body.roleId).toEqual(customRole._id)
        expect(res.body.roleId).not.toEqual(roles.BUILTIN_ROLE_IDS.PUBLIC)
        expect(res.body._id).toEqual(generateUserMetadataID(user._id!))
      })
    })
  })
})
