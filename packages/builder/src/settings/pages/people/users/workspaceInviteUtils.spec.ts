import { beforeEach, describe, expect, it, vi } from "vitest"
import { Constants } from "@budibase/frontend-core"
import type { UserGroup } from "@budibase/types"

const mocks = vi.hoisted(() => ({
  fetchUsers: vi.fn(),
  addGroupUser: vi.fn(),
}))

vi.mock("@/stores/portal/users", () => ({
  users: {
    fetch: mocks.fetchUsers,
  },
}))

vi.mock("@/stores/portal/groups", () => ({
  groups: {
    addUser: mocks.addGroupUser,
  },
}))

import {
  assignExistingUsersToGroups,
  buildWorkspaceInvitePayload,
  getEffectiveGroupIds,
  shouldUseGroupWorkspaceRole,
} from "./workspaceInviteUtils"

describe("workspaceInviteUtils", () => {
  const workspaceId = "workspace_123"

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.fetchUsers.mockResolvedValue([])
    mocks.addGroupUser.mockResolvedValue(undefined)
  })

  it("uses group workspace role for app users with basic role when default group controls the workspace", () => {
    const allGroups: UserGroup[] = [
      {
        _id: "group_default",
        isDefault: true,
        name: "Default",
        icon: "ri-user-line",
        color: "#000000",
        roles: {
          [workspaceId]: Constants.Roles.ADMIN,
        },
      },
    ]

    expect(
      shouldUseGroupWorkspaceRole({
        workspaceId,
        role: Constants.BudibaseRoles.AppUser,
        appRole: Constants.Roles.BASIC,
        allGroups,
      })
    ).toBe(true)
  })

  it("does not use group workspace role when non-basic app role is selected", () => {
    expect(
      shouldUseGroupWorkspaceRole({
        workspaceId,
        role: Constants.BudibaseRoles.AppUser,
        appRole: Constants.Roles.ADMIN,
        selectedGroupIds: ["group_default"],
        allGroups: [
          {
            _id: "group_default",
            isDefault: true,
            name: "Default",
            icon: "ri-user-line",
            color: "#000000",
            roles: {
              [workspaceId]: Constants.Roles.ADMIN,
            },
          },
        ],
      })
    ).toBe(false)
  })

  it("does not infer default-group workspace role when default fallback is disabled", () => {
    expect(
      shouldUseGroupWorkspaceRole({
        workspaceId,
        role: Constants.BudibaseRoles.AppUser,
        appRole: Constants.Roles.BASIC,
        allGroups: [
          {
            _id: "group_default",
            isDefault: true,
            name: "Default",
            icon: "ri-user-line",
            color: "#000000",
            roles: {
              [workspaceId]: Constants.Roles.ADMIN,
            },
          },
        ],
        useDefaultGroupFallback: false,
      })
    ).toBe(false)
  })

  it("does not set workspace apps payload when group-managed workspace role applies", () => {
    const payload = buildWorkspaceInvitePayload(
      [
        {
          email: "group-user@example.com",
          role: Constants.BudibaseRoles.AppUser,
          appRole: Constants.Roles.BASIC,
          password: "password",
        },
      ],
      [],
      workspaceId,
      true,
      [
        {
          _id: "group_default",
          isDefault: true,
          name: "Default",
          icon: "ri-user-line",
          color: "#000000",
          roles: {
            [workspaceId]: Constants.Roles.ADMIN,
          },
        },
      ]
    )

    expect(payload[0].apps).toBeUndefined()
  })

  it("sets workspace apps payload when no group controls the workspace", () => {
    const payload = buildWorkspaceInvitePayload(
      [
        {
          email: "basic-user@example.com",
          role: Constants.BudibaseRoles.AppUser,
          appRole: Constants.Roles.BASIC,
          password: "password",
        },
      ],
      [],
      workspaceId,
      true,
      []
    )

    expect(payload[0].apps).toEqual({ [workspaceId]: Constants.Roles.BASIC })
  })

  it("resolves default group id when no groups are selected", () => {
    expect(
      getEffectiveGroupIds(
        [],
        [
          {
            _id: "group_default",
            isDefault: true,
            name: "Default",
            icon: "ri-user-line",
            color: "#000000",
          },
        ]
      )
    ).toEqual(["group_default"])
  })

  it("adds existing organisation users to selected groups they are missing", async () => {
    mocks.fetchUsers.mockResolvedValue([
      {
        _id: "user_existing",
        email: "existing@example.com",
        userGroups: ["group_existing"],
      },
    ])

    const result = await assignExistingUsersToGroups({
      groups: ["group_existing", "group_new"],
      users: [
        {
          email: "existing@example.com",
          role: Constants.BudibaseRoles.Creator,
          password: "password",
        },
        {
          email: "new@example.com",
          role: Constants.BudibaseRoles.Creator,
          password: "password",
        },
      ],
    })

    expect(mocks.addGroupUser).toHaveBeenCalledTimes(1)
    expect(mocks.addGroupUser).toHaveBeenCalledWith(
      "group_new",
      "user_existing"
    )
    expect(result).toEqual({
      newUsers: [
        {
          email: "new@example.com",
          role: Constants.BudibaseRoles.Creator,
          password: "password",
        },
      ],
      assignedCount: 1,
      failedCount: 0,
    })
  })

  it("does not re-add existing organisation users to groups they already belong to", async () => {
    mocks.fetchUsers.mockResolvedValue([
      {
        _id: "user_existing",
        email: "existing@example.com",
        userGroups: ["group_existing"],
      },
    ])

    const result = await assignExistingUsersToGroups({
      groups: ["group_existing"],
      users: [
        {
          email: "existing@example.com",
          role: Constants.BudibaseRoles.Creator,
          password: "password",
        },
      ],
    })

    expect(mocks.addGroupUser).not.toHaveBeenCalled()
    expect(result).toEqual({
      newUsers: [],
      assignedCount: 0,
      failedCount: 0,
    })
  })
})
