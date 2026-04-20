jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    users: {
      ...core.users,
      getAllUsers: jest.fn(),
      UserDB: {
        init: jest.fn(),
        bulkDelete: jest.fn(),
      },
      bulkUpdateGlobalUsers: jest.fn(),
    },
    utils: {
      ...core.utils,
      hash: jest.fn(),
    },
  }
})

import { users as usersCore, utils } from "@budibase/backend-core"
import { User } from "@budibase/types"
import { handleDisable } from "../users"

const getAllUsersMock = usersCore.getAllUsers as jest.Mock
const bulkDeleteMock = usersCore.UserDB.bulkDelete as jest.Mock
const bulkUpdateMock = usersCore.bulkUpdateGlobalUsers as jest.Mock
const hashMock = utils.hash as jest.Mock

const buildSCIMUser = (overrides: Partial<User> = {}): User =>
  ({
    _id: "user_1",
    email: "scim@example.com",
    tenantId: "default",
    roles: {},
    scimInfo: { isSync: true },
    ssoId: "sso_123",
    ...overrides,
  }) as User

describe("handleDisable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    hashMock.mockResolvedValue("hashed-password")
  })

  it("returns early without calling any mutation when there are no SCIM users", async () => {
    getAllUsersMock.mockResolvedValue([buildSCIMUser({ scimInfo: undefined })])

    await handleDisable("remove")

    expect(bulkDeleteMock).not.toHaveBeenCalled()
    expect(bulkUpdateMock).not.toHaveBeenCalled()
  })

  describe("remove action", () => {
    it("bulk deletes all SCIM-synced users", async () => {
      const user1 = buildSCIMUser({ _id: "user_1", email: "u1@example.com" })
      const user2 = buildSCIMUser({ _id: "user_2", email: "u2@example.com" })
      getAllUsersMock.mockResolvedValue([user1, user2])

      await handleDisable("remove")

      expect(bulkDeleteMock).toHaveBeenCalledTimes(1)
      expect(bulkDeleteMock).toHaveBeenCalledWith([
        { userId: "user_1", email: "u1@example.com" },
        { userId: "user_2", email: "u2@example.com" },
      ])
    })

    it("ignores non-SCIM users and only deletes SCIM-synced ones", async () => {
      const scimUser = buildSCIMUser({
        _id: "user_1",
        email: "scim@example.com",
      })
      const regularUser = buildSCIMUser({
        _id: "user_2",
        email: "regular@example.com",
        scimInfo: undefined,
      })
      getAllUsersMock.mockResolvedValue([scimUser, regularUser])

      await handleDisable("remove")

      expect(bulkDeleteMock).toHaveBeenCalledWith([
        { userId: "user_1", email: "scim@example.com" },
      ])
    })
  })

  describe("convert action", () => {
    it("strips scimInfo and ssoId and sets a new hashed password", async () => {
      const scimUser = buildSCIMUser({
        _id: "user_1",
        email: "scim@example.com",
        scimInfo: { isSync: true },
        ssoId: "sso_abc",
      })
      getAllUsersMock.mockResolvedValue([scimUser])

      await handleDisable("convert")

      expect(bulkUpdateMock).toHaveBeenCalledTimes(1)
      const [updatedUsers] = bulkUpdateMock.mock.calls[0]
      expect(updatedUsers).toHaveLength(1)
      expect(updatedUsers[0]).not.toHaveProperty("scimInfo")
      expect(updatedUsers[0]).not.toHaveProperty("ssoId")
      expect(updatedUsers[0].password).toEqual("hashed-password")
    })

    it("converts all SCIM-synced users preserving other fields", async () => {
      const user1 = buildSCIMUser({ _id: "user_1", email: "u1@example.com" })
      const user2 = buildSCIMUser({ _id: "user_2", email: "u2@example.com" })
      getAllUsersMock.mockResolvedValue([user1, user2])

      await handleDisable("convert")

      const [updatedUsers] = bulkUpdateMock.mock.calls[0]
      expect(updatedUsers).toHaveLength(2)
      expect(updatedUsers[0]).toMatchObject({
        _id: "user_1",
        email: "u1@example.com",
      })
      expect(updatedUsers[1]).toMatchObject({
        _id: "user_2",
        email: "u2@example.com",
      })
    })

    it("does not call bulkDelete when converting", async () => {
      getAllUsersMock.mockResolvedValue([buildSCIMUser()])

      await handleDisable("convert")

      expect(bulkDeleteMock).not.toHaveBeenCalled()
    })
  })
})
