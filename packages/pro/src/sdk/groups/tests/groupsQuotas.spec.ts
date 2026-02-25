import { UserGroup } from "@budibase/types"

import { generator } from "../../../../tests"

const GROUP_ID = `test-group-${generator.guid()}`
const APP_ID = `test-app-${generator.guid()}`
const APP2_ID = `test-app-${generator.guid()}`

const USER_1_ID = `test-user-${generator.guid()}`
const USER_2_ID = `test-user-${generator.guid()}`
const USER_3_ID = `test-user-${generator.guid()}`

const group: UserGroup = {
  color: "",
  icon: "",
  name: "",
  _id: GROUP_ID,
  roles: { [APP_ID]: "POWER", [APP2_ID]: "POWER" },
  users: [
    { _id: USER_1_ID, email: `${USER_1_ID}@test.com` },
    { _id: USER_2_ID, email: `${USER_2_ID}@test.com` },
    { _id: USER_3_ID, email: `${USER_3_ID}@test.com` },
  ],
}

jest.mock("../../../db")
import * as _db from "../../../db"
const { groups } = jest.mocked(_db)
groups.save.mockResolvedValue({ id: GROUP_ID, rev: generator.guid() })
groups.get.mockResolvedValue(group)
groups.getGroupUsers.mockResolvedValue(group.users!)

import {
  save,
  addUsers,
  removeUsers,
  remove,
  adjustGroupCreatorsQuotas,
} from "../groups"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    ...{
      events: {
        group: {
          updated: jest.fn(),
          permissionsEdited: jest.fn(),
          usersAdded: jest.fn(),
          usersDeleted: jest.fn(),
          deleted: jest.fn(),
        },
      },
    },
  }
})

jest.mock("../../../sdk/quotas")
import * as _quotas from "../../../sdk/quotas"

jest.mock("../../features")
import * as _features from "../../features"

const features = jest.mocked(_features, { shallow: true })

const quotas = jest.mocked(_quotas, { shallow: false })
quotas.addUsers.mockReturnValue(Promise.resolve())
quotas.removeUsers.mockReturnValue(Promise.resolve())
quotas.removeGroup.mockReturnValue(Promise.resolve())

describe("Creators quotas by group assignment", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shouldn't increment creators quotas if group doesn't have creator role", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate basic users with no groups assigned
      for (let userId of [USER_1_ID, USER_2_ID, USER_3_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "ADMIN" },
          userGroups: [],
        })
      }

      await addUsers(GROUP_ID, [USER_1_ID, USER_2_ID, USER_3_ID])

      expect(quotas.removeUsers).not.toHaveBeenCalled()
      expect(quotas.addUsers).not.toHaveBeenCalled()
    })
  })

  it("shouldn't decrement creators quotas if basic users are removed from non-creator group", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate admin users in the group
      for (let userId of [USER_1_ID, USER_2_ID, USER_3_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "ADMIN" },
          userGroups: [GROUP_ID],
        })
      }

      // Before removeUsers, tenant has 0 creators
      // After take out 2 users, still will have 0 creators because group doesn't have admin permissions (no action needed)
      await removeUsers(GROUP_ID, [USER_1_ID, USER_2_ID])

      expect(quotas.addUsers).not.toHaveBeenCalled()
      expect(quotas.removeUsers).not.toHaveBeenCalled()
    })
  })

  it("should decrement creators quotas if a creator group with basic users is removed", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate an admin group
      const adminGroup = {
        ...group,
        ...{
          users: [USER_1_ID, USER_2_ID, USER_3_ID],
          roles: { [APP_ID]: "CREATOR" },
        },
      }
      groups.get.mockResolvedValue(adminGroup)
      const persistedGroup = await db.put(adminGroup)
      groups.destroy.mockResolvedValue({
        id: GROUP_ID,
        rev: persistedGroup.rev,
      })

      // Generate basic users in the group
      for (let userId of [USER_1_ID, USER_2_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [GROUP_ID, "not_existent_grp"],
        })
      }

      // Generate a creator user in the group
      await db.put({
        _id: USER_3_ID,
        tenantId,
        email: `${USER_3_ID}@test.com`,
        roles: { [APP_ID]: "CREATOR" },
        userGroups: [GROUP_ID],
      })

      // Before remove, tenant has 3 creators because of the users assignment to an admin group
      // After group removal, tenant will have 1 creator because it has the creator role
      await remove(GROUP_ID, persistedGroup.rev)

      const USERS_TO_REMOVE = 0
      const CREATORS_TO_REMOVE = 2
      expect(quotas.addUsers).not.toHaveBeenCalled()
      expect(quotas.removeUsers).toHaveBeenCalledWith(
        USERS_TO_REMOVE,
        CREATORS_TO_REMOVE
      )

      // Recalculation of creators quotas should be done after group recalculation quotas
      const removeUsersCallOrder =
        quotas.removeUsers.mock.invocationCallOrder[0]
      const removeGroupCallOrder =
        quotas.removeGroup.mock.invocationCallOrder[0]
      expect(removeGroupCallOrder).toBeLessThan(removeUsersCallOrder)
    })
  })

  it("should increment creators quotas if a group with basic users is promoted to creator", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate group
      await db.put(group)

      // Generate app creator user
      const user1 = {
        _id: USER_1_ID,
        tenantId,
        email: `${USER_1_ID}@test.com`,
        roles: { [APP_ID]: "CREATOR" },
        userGroups: [GROUP_ID, "not_existent_grp"],
      }
      await db.put(user1)

      // Generate basic user
      const user2 = {
        _id: USER_2_ID,
        tenantId,
        email: `${USER_2_ID}@test.com`,
        roles: { [APP_ID]: "BASIC" },
        userGroups: [GROUP_ID],
      }
      await db.put(user2)

      // Generate no roles user
      const user3 = {
        _id: USER_3_ID,
        tenantId,
        email: `${USER_3_ID}@test.com`,
        roles: { [APP_ID]: "BASIC" },
        userGroups: [GROUP_ID],
      }
      await db.put(user3)

      // Before save, tenant only has a creator; group doesn't have ADMIN permissions yet
      // After update, tenant will have 3 creators because of the group promotion
      const groupUpdate: UserGroup = {
        ...group,
        ...{ roles: { [APP_ID]: "CREATOR", [APP2_ID]: "CREATOR" } },
      }
      await save(groupUpdate)

      expect(quotas.addUsers).toHaveBeenCalledTimes(1)
      const USERS_TO_ADD = 0
      const CREATORS_TO_ADD = 2
      expect(quotas.addUsers).toHaveBeenCalledWith(
        USERS_TO_ADD,
        CREATORS_TO_ADD
      )
    })
  })

  it("should decrement creators quotas if a group with creator users is demoted to lower role", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      const creatorGroup = { ...group, ...{ roles: { [APP_ID]: "CREATOR" } } }
      groups.get.mockReturnValue(Promise.resolve(creatorGroup))
      await db.put(creatorGroup)

      const basicGroup = { ...group, ...{ roles: { [APP_ID]: "BASIC" } } }
      groups.save.mockImplementation(async () => {
        const currentGroup = await db.get(GROUP_ID)
        const updatedGroup = await db.put({
          ...basicGroup,
          ...{ _rev: currentGroup._rev },
        })
        return { id: GROUP_ID, _rev: updatedGroup.rev }
      })

      // Generate basic users
      for (let userId of [USER_1_ID, USER_2_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [GROUP_ID, "not_existent_grp"],
        })
      }

      // Generate a creator user
      await db.put({
        _id: USER_3_ID,
        tenantId,
        email: `${USER_3_ID}@test.com`,
        roles: { [APP_ID]: "CREATOR" },
        userGroups: [GROUP_ID],
      })

      // Before save, tenant has two creators because of the admin group assignment
      // After update, tenant will have 0 creators because of the group demotion
      await save(basicGroup)

      expect(quotas.removeUsers).toHaveBeenCalledTimes(1)
      const USERS_TO_REMOVE = 0
      const CREATORS_TO_REMOVE = 2
      expect(quotas.removeUsers).toHaveBeenCalledWith(
        USERS_TO_REMOVE,
        CREATORS_TO_REMOVE
      )
    })
  })

  it("shouldn't decrement creators quotas if tenant has users in a basic group and changes to a plan without groups feature", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate basic users in the group
      for (let userId of [USER_1_ID, USER_2_ID, USER_3_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [GROUP_ID],
        })
      }

      // Despite that tenant has configured groups, current plan doesn't allow user groups feature
      features.isUserGroupsEnabled.mockResolvedValue(false)

      await adjustGroupCreatorsQuotas()

      expect(quotas.addUsers).not.toHaveBeenCalled()
      expect(quotas.removeUsers).not.toHaveBeenCalled()
    })
  })

  it("should decrement creators quotas if tenant has basic users in a creator group and changes to a plan without groups feature", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate an admin group
      const adminGroup = {
        ...group,
        ...{
          users: [USER_1_ID, USER_2_ID, USER_3_ID],
          roles: { [APP_ID]: "CREATOR" },
        },
      }
      groups.fetch.mockResolvedValue([adminGroup])
      groups.get.mockResolvedValue(adminGroup)
      await db.put(adminGroup)

      // Generate basic users in the group
      for (let userId of [USER_1_ID, USER_2_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [GROUP_ID],
        })
      }

      // Generate a creator user in the group
      await db.put({
        _id: USER_3_ID,
        tenantId,
        email: `${USER_3_ID}@test.com`,
        roles: { [APP_ID]: "CREATOR" },
        userGroups: [GROUP_ID],
      })

      // Despite that tenant has configured groups, current plan doesn't allow user groups feature
      features.isUserGroupsEnabled.mockResolvedValue(false)

      await adjustGroupCreatorsQuotas()

      expect(quotas.addUsers).not.toHaveBeenCalled()
      const USERS_TO_REMOVE = 0
      const CREATORS_TO_REMOVE = 2
      expect(quotas.removeUsers).toHaveBeenCalledWith(
        USERS_TO_REMOVE,
        CREATORS_TO_REMOVE
      )
    })
  })

  it("should increment creators quotas if basic users are added to admin group", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate an empty group
      const creatorGroup = {
        ...group,
        ...{ users: [], roles: { [APP_ID]: "CREATOR" } },
      }
      groups.get.mockResolvedValue(creatorGroup)
      groups.getGroupUsers.mockReturnValue([])
      await db.put(creatorGroup)

      // Generate basic users with no groups assigned
      for (let userId of [USER_1_ID, USER_2_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [],
        })
      }

      // Generate a creator user with a non-existent group assigned
      await db.put({
        _id: USER_3_ID,
        tenantId,
        email: `${USER_3_ID}@test.com`,
        roles: { [APP_ID]: "CREATOR" },
        userGroups: ["non-existent-group"],
      })

      // Before addUsers, tenant only has a creator; users are not assigned to any group
      // After update, tenant will have 3 creators because of the users assignment to an admin group
      await addUsers(GROUP_ID, [USER_1_ID, USER_2_ID, USER_3_ID])

      expect(quotas.removeUsers).not.toHaveBeenCalled()
      expect(quotas.addUsers).toHaveBeenCalledTimes(1)
      const USERS_TO_ADD = 0
      const CREATORS_TO_ADD = 2
      expect(quotas.addUsers).toHaveBeenCalledWith(
        USERS_TO_ADD,
        CREATORS_TO_ADD
      )
    })
  })

  it("should decrement creators quotas if basic users are removed from admin group", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate an empty group
      const creatorGroup = {
        ...group,
        ...{ users: [], roles: { [APP_ID]: "CREATOR" } },
      }
      groups.get.mockResolvedValue(creatorGroup)
      groups.getGroupUsers.mockReturnValue([])
      await db.put(creatorGroup)

      // Generate basic users in the group
      for (let userId of [USER_1_ID, USER_2_ID, USER_3_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "BASIC" },
          userGroups: [GROUP_ID, "not_existent_grp"],
        })
      }

      // Before removeUsers, tenant has 3 creators because of the users assignment to an admin group
      // After take out 2 users, tenant will have 1 creator because of the group remo
      await removeUsers(GROUP_ID, [USER_1_ID, USER_2_ID])

      expect(quotas.addUsers).not.toHaveBeenCalled()
      expect(quotas.removeUsers).toHaveBeenCalledTimes(1)
      const USERS_TO_REMOVE = 0
      const CREATORS_TO_REMOVE = 2
      expect(quotas.removeUsers).toHaveBeenCalledWith(
        USERS_TO_REMOVE,
        CREATORS_TO_REMOVE
      )
    })
  })

  it("shouldn't decrement creators quotas if creators users are removed from admin group", async () => {
    const tenantId = `test_tenant_${generator.guid()}`

    const { context } = require("@budibase/backend-core")
    const { groups } = require("../../../db")

    await context.doInTenant(tenantId, async () => {
      const db = context.getGlobalDB()

      // Generate an empty group
      const adminGroup = {
        ...group,
        ...{ users: [], roles: { [APP_ID]: "ADMIN" } },
      }
      groups.get.mockResolvedValue(adminGroup)
      groups.getGroupUsers.mockReturnValue([])
      await db.put(adminGroup)

      // Generate admin users in the group
      for (let userId of [USER_1_ID, USER_2_ID, USER_3_ID]) {
        await db.put({
          _id: userId,
          tenantId,
          email: `${userId}@test.com`,
          roles: { [APP_ID]: "ADMIN" },
          userGroups: [GROUP_ID, "not_existent_grp"],
        })
      }

      // Before removeUsers, tenant has 3 creators because of the users assignment to an admin group
      // After take out 2 users, still will have 3 creators because the assigned users are already creators
      await removeUsers(GROUP_ID, [USER_1_ID, USER_2_ID])

      expect(quotas.addUsers).not.toHaveBeenCalled()
      expect(quotas.removeUsers).not.toHaveBeenCalled()
    })
  })
})
