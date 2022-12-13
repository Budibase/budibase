import { structures, TestConfiguration } from "../../../../tests"
import { context, db, permissions, roles } from "@budibase/backend-core"
import { Mock } from "jest-mock"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
    },
    context: {
      ...core.context,
      getAppDB: jest.fn(),
    },
  }
})

const appDb = db.getDB("app_test")
const mockAppDB = context.getAppDB as Mock
mockAppDB.mockReturnValue(appDb)

async function addAppMetadata() {
  await appDb.put({
    _id: "app_metadata",
    appId: "app_test",
    name: "New App",
    version: "version",
    url: "url",
  })
}

describe("/api/global/roles", () => {
  const config = new TestConfiguration()
  const role = new roles.Role(
    db.generateRoleID("newRole"),
    roles.BUILTIN_ROLE_IDS.BASIC,
    permissions.BuiltinPermissionID.READ_ONLY
  )

  beforeAll(async () => {
    console.debug(role)
    appDb.put(role)
    await addAppMetadata()
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/global/roles", () => {
    it("retrieves roles", async () => {
      const res = await config.api.roles.get()
      expect(res.body).toBeDefined()
      expect(res.body["app_test"].roles.length).toEqual(5)
      expect(res.body["app_test"].roles.map((r: any) => r._id)).toContain(
        role._id
      )
    })
  })

  describe("GET api/global/roles/:appId", () => {
    it("finds a role by appId", async () => {
      const res = await config.api.roles.find("app_test")
      expect(res.body).toBeDefined()
      expect(res.body.name).toEqual("New App")
    })
  })

  describe("DELETE /api/global/roles/:appId", () => {
    it("removes an app role", async () => {
      let user = structures.users.user()
      user.roles = {
        app_test: "role1",
      }
      const userResponse = await config.createUser(user)
      const res = await config.api.roles.remove("app_test")
      const updatedUser = await config.api.users.getUser(userResponse._id!)
      expect(updatedUser.body.roles).not.toHaveProperty("app_test")
      expect(res.body.message).toEqual("App role removed from all users")
    })
  })
})
