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
