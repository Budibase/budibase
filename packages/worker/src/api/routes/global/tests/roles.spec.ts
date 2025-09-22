import { context, db, roles } from "@budibase/backend-core"
import {
  BuiltinPermissionID,
  Database,
  WithoutDocMetadata,
  Workspace,
} from "@budibase/types"
import { structures, TestConfiguration } from "../../../../tests"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
    },
    context: {
      ...core.context,
      getWorkspaceDB: jest.fn(),
    },
  }
})

let workspaceId: string
let workspaceDb: Database
const ROLE_NAME = "newRole"

async function addAppMetadata() {
  await workspaceDb.put({
    _id: "app_metadata",
    appId: workspaceId,
    name: "New App",
    version: "version",
    url: "url",
  })
}

async function updateAppMetadata(
  update: Partial<WithoutDocMetadata<Workspace>>
) {
  const app = await workspaceDb.get("app_metadata")
  await workspaceDb.put({
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
    workspaceId = db.generateWorkspaceID(config.tenantId)
    workspaceDb = db.getDB(workspaceId)
    const mockWorkspaceDB = context.getWorkspaceDB as jest.Mock
    mockWorkspaceDB.mockReturnValue(workspaceDb)

    await addAppMetadata()
    await workspaceDb.put(role)
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
      expect(res.body[workspaceId].roles.length).toEqual(5)
      expect(res.body[workspaceId].roles.map((r: any) => r._id)).toContain(
        ROLE_NAME
      )
    })

    it.each(["3.0.0", "3.0.1", "3.1.0", "3.0.0+2146.b125a7c"])(
      "exclude POWER roles after v3 (%s)",
      async creationVersion => {
        await updateAppMetadata({ creationVersion })
        const res = await config.api.roles.get()
        expect(res.body).toBeDefined()
        expect(res.body[workspaceId].roles.map((r: any) => r._id)).toEqual([
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
        expect(res.body[workspaceId].roles.map((r: any) => r._id)).toEqual([
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

        expect(res.body[workspaceId].roles.map((r: any) => r._id)).toEqual([
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
      const res = await config.api.roles.find(workspaceId)
      expect(res.body).toBeDefined()
      expect(res.body.name).toEqual("New App")
    })
  })

  describe("DELETE /api/global/roles/:appId", () => {
    async function createBuilderUser() {
      const saveResponse = await config.api.users.saveUser(
        structures.users.builderUser(),
        200
      )
      const { body: user } = await config.api.users.getUser(
        saveResponse.body._id
      )
      await config.login(user)
      return user
    }

    it("removes an app role", async () => {
      let user = structures.users.user()
      user.roles = {
        app_test: "role1",
      }
      const userResponse = await config.createUser(user)
      const res = await config.api.roles.remove(workspaceId)
      const updatedUser = await config.api.users.getUser(userResponse._id!)
      expect(updatedUser.body.roles).not.toHaveProperty(workspaceId)
      expect(res.body.message).toEqual("App role removed from all users")
    })

    it("should not allow creator users to remove app roles", async () => {
      const builderUser = await createBuilderUser()

      const res = await config.withUser(builderUser, () =>
        config.api.roles.remove(workspaceId, { status: 403 })
      )
      expect(res.body.message).toBe("Admin user only endpoint.")
    })
  })
})
