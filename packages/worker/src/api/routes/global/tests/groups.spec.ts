import { events } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { structures, TestConfiguration, mocks } from "../../../../tests"
import { UserGroup } from "@budibase/types"

mocks.licenses.useGroups()

describe("/api/global/groups", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    mocks.licenses.useGroups()
  })

  describe("create", () => {
    it("should be able to create a new group", async () => {
      const group = structures.groups.UserGroup()
      await config.api.groups.saveGroup(group)
      expect(events.group.created).toBeCalledTimes(1)
      expect(events.group.updated).not.toBeCalled()
      expect(events.group.permissionsEdited).not.toBeCalled()
    })

    it("should not allow undefined names", async () => {
      const group = { ...structures.groups.UserGroup(), name: undefined } as any
      const response = await config.api.groups.saveGroup(group, { expect: 400 })
      expect(JSON.parse(response.text).message).toEqual(
        'Invalid body - "name" is required'
      )
    })

    it("should not allow empty names", async () => {
      const group = { ...structures.groups.UserGroup(), name: "" }
      const response = await config.api.groups.saveGroup(group, { expect: 400 })
      expect(JSON.parse(response.text).message).toEqual(
        'Invalid body - "name" is not allowed to be empty'
      )
    })

    it("should not allow whitespace names", async () => {
      const group = { ...structures.groups.UserGroup(), name: "   " }
      const response = await config.api.groups.saveGroup(group, { expect: 400 })
      expect(JSON.parse(response.text).message).toEqual(
        'Invalid body - "name" is not allowed to be empty'
      )
    })

    it("should trim names", async () => {
      const group = { ...structures.groups.UserGroup(), name: "   group name " }
      await config.api.groups.saveGroup(group)
      expect(events.group.created).toBeCalledWith(
        expect.objectContaining({ name: "group name" })
      )
    })

    describe("name max length", () => {
      const maxLength = 50

      it(`should allow names shorter than ${maxLength} characters`, async () => {
        const group = {
          ...structures.groups.UserGroup(),
          name: structures.generator.word({ length: maxLength }),
        }
        await config.api.groups.saveGroup(group, { expect: 200 })
      })

      it(`should not allow names longer than ${maxLength} characters`, async () => {
        const group = {
          ...structures.groups.UserGroup(),
          name: structures.generator.word({ length: maxLength + 1 }),
        }
        const response = await config.api.groups.saveGroup(group, {
          expect: 400,
        })
        expect(JSON.parse(response.text).message).toEqual(
          'Invalid body - "name" length must be less than or equal to 50 characters long'
        )
      })
    })
  })

  describe("update", () => {
    it("should be able to update a basic group", async () => {
      const group = structures.groups.UserGroup()
      let oldGroup = await config.api.groups.saveGroup(group)

      let updatedGroup = {
        ...oldGroup.body,
        ...group,
        name: "New Name",
      }
      await config.api.groups.saveGroup(updatedGroup)

      expect(events.group.updated).toBeCalledTimes(1)
      expect(events.group.permissionsEdited).not.toBeCalled()
    })

    describe("destroy", () => {
      it("should be able to delete a basic group", async () => {
        const group = structures.groups.UserGroup()
        let oldGroup = await config.api.groups.saveGroup(group)
        await config.api.groups.deleteGroup(
          oldGroup.body._id,
          oldGroup.body._rev
        )

        expect(events.group.deleted).toBeCalledTimes(1)
      })
    })
  })

  describe("find users", () => {
    describe("without users", () => {
      let group: UserGroup
      beforeAll(async () => {
        group = structures.groups.UserGroup()
        await config.api.groups.saveGroup(group)
      })

      it("should return empty", async () => {
        const result = await config.api.groups.searchUsers(group._id!)
        expect(result.body).toEqual({
          users: [],
          bookmark: undefined,
          hasNextPage: false,
        })
      })
    })

    describe("existing users", () => {
      let groupId: string
      let users: { _id: string; email: string }[] = []

      beforeAll(async () => {
        groupId = (
          await config.api.groups.saveGroup(structures.groups.UserGroup())
        ).body._id

        await Promise.all(
          Array.from({ length: 30 }).map(async (_, i) => {
            const email = `user${i}@${generator.domain()}`
            const user = await config.api.users.saveUser({
              ...structures.users.user(),
              email,
            })
            users.push({ _id: user.body._id, email })
          })
        )
        users = users.sort((a, b) => a._id.localeCompare(b._id))
        await config.api.groups.updateGroupUsers(groupId, {
          add: users.map(u => u._id),
          remove: [],
        })
      })

      describe("pagination", () => {
        it("should return first page", async () => {
          const result = await config.api.groups.searchUsers(groupId)
          expect(result.body).toEqual({
            users: users.slice(0, 10),
            bookmark: users[10]._id,
            hasNextPage: true,
          })
        })

        it("given a bookmark, should return skip items", async () => {
          const result = await config.api.groups.searchUsers(groupId, {
            bookmark: users[7]._id,
          })
          expect(result.body).toEqual({
            users: users.slice(7, 17),
            bookmark: users[17]._id,
            hasNextPage: true,
          })
        })

        it("bookmarking the last page, should return last page info", async () => {
          const result = await config.api.groups.searchUsers(groupId, {
            bookmark: users[20]._id,
          })
          expect(result.body).toEqual({
            users: users.slice(20),
            bookmark: undefined,
            hasNextPage: false,
          })
        })
      })

      describe("search by email", () => {
        it('should be able to search "starting" by email', async () => {
          const result = await config.api.groups.searchUsers(groupId, {
            emailSearch: `user1`,
          })

          const matchedUsers = users
            .filter(u => u.email.startsWith("user1"))
            .sort((a, b) => a.email.localeCompare(b.email))

          expect(result.body).toEqual({
            users: matchedUsers.slice(0, 10),
            bookmark: matchedUsers[10].email,
            hasNextPage: true,
          })
        })

        it("should be able to bookmark when searching by email", async () => {
          const matchedUsers = users
            .filter(u => u.email.startsWith("user1"))
            .sort((a, b) => a.email.localeCompare(b.email))

          const result = await config.api.groups.searchUsers(groupId, {
            emailSearch: `user1`,
            bookmark: matchedUsers[4].email,
          })

          expect(result.body).toEqual({
            users: matchedUsers.slice(4),
            bookmark: undefined,
            hasNextPage: false,
          })
        })
      })
    })
  })
})
