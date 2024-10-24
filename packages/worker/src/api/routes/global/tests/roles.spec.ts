import { structures, TestConfiguration } from "../../../../tests"
import { context, db, roles } from "@budibase/backend-core"
import { App, Database, BuiltinPermissionID } from "@budibase/types"

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

let appId: string
let appDb: Database
const ROLE_NAME = "newRole"

async function addAppMetadata() {
  await appDb.put({
    _id: "app_metadata",
    appId: appId,
    name: "New App",
    version: "version",
    url: "url",
  })
}

async function updateAppMetadata(update: Partial<Omit<App, "_id" | "_rev">>) {
  const app = await appDb.get("app_metadata")
  await appDb.put({
    ...app,
    ...update,
  })
}

describe("/api/global/roles", () => {
  const config = new TestConfiguration()

  const role = new roles.Role(
    db.generateRoleID(ROLE_NAME),
    ROLE_NAME,
    BuiltinPermissionID.READ_ONLY,
    { displayName: roles.BUILTIN_ROLE_IDS.BASIC }
  )

  beforeAll(async () => {
    await config.beforeAll()
  })

  beforeEach(async () => {
    appId = db.generateAppID(config.tenantId)
    appDb = db.getDB(appId)
    const mockAppDB = context.getAppDB as jest.Mock
    mockAppDB.mockReturnValue(appDb)

    await addAppMetadata()
    await appDb.put(role)
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
      expect(res.body[appId].roles.length).toEqual(5)
      expect(res.body[appId].roles.map((r: any) => r._id)).toContain(ROLE_NAME)
    })

    it.each(["3.0.0", "3.0.1", "3.1.0", "3.0.0+2146.b125a7c"])(
      "exclude POWER roles after v3 (%s)",
      async creationVersion => {
        await updateAppMetadata({ creationVersion })
        const res = await config.api.roles.get()
        expect(res.body).toBeDefined()
        expect(res.body[appId].roles.map((r: any) => r._id)).toEqual([
          ROLE_NAME,
          roles.BUILTIN_ROLE_IDS.ADMIN,
          roles.BUILTIN_ROLE_IDS.BASIC,
          roles.BUILTIN_ROLE_IDS.PUBLIC,
        ])
      }
    )

    it.each(["2.9.0", "1.0.0", "0.0.0", "2.32.17+2146.b125a7c"])(
      "include POWER roles before v3 (%s)",
      async creationVersion => {
        await updateAppMetadata({ creationVersion })
        const res = await config.api.roles.get()
        expect(res.body).toBeDefined()
        expect(res.body[appId].roles.map((r: any) => r._id)).toEqual([
          ROLE_NAME,
          roles.BUILTIN_ROLE_IDS.ADMIN,
          roles.BUILTIN_ROLE_IDS.POWER,
          roles.BUILTIN_ROLE_IDS.BASIC,
          roles.BUILTIN_ROLE_IDS.PUBLIC,
        ])
      }
    )

    it.each(["invalid", ""])(
      "include POWER roles when the version is corrupted (%s)",
      async creationVersion => {
        await updateAppMetadata({ creationVersion })
        const res = await config.api.roles.get()

        expect(res.body[appId].roles.map((r: any) => r._id)).toEqual([
          ROLE_NAME,
          roles.BUILTIN_ROLE_IDS.ADMIN,
          roles.BUILTIN_ROLE_IDS.POWER,
          roles.BUILTIN_ROLE_IDS.BASIC,
          roles.BUILTIN_ROLE_IDS.PUBLIC,
        ])
      }
    )
  })

  describe("GET api/global/roles/:appId", () => {
    it("finds a role by appId", async () => {
      const res = await config.api.roles.find(appId)
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
      const res = await config.api.roles.remove(appId)
      const updatedUser = await config.api.users.getUser(userResponse._id!)
      expect(updatedUser.body.roles).not.toHaveProperty(appId)
      expect(res.body.message).toEqual("App role removed from all users")
    })
  })
})
