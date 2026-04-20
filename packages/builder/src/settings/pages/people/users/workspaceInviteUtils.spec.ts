import { describe, expect, it } from "vitest"
import { Constants } from "@budibase/frontend-core"
import type { UserGroup } from "@budibase/types"
import {
  buildWorkspaceInvitePayload,
  getEffectiveGroupIds,
  shouldUseGroupWorkspaceRole,
} from "./workspaceInviteUtils"

describe("workspaceInviteUtils", () => {
  const workspaceId = "workspace_123"

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
})
