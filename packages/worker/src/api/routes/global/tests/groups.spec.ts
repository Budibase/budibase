import { events } from "@budibase/backend-core"
import { structures, TestConfiguration, mocks } from "../../../../tests"

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
})
