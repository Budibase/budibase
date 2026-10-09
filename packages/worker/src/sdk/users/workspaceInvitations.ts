import {
  configs,
  context,
  db as dbCore,
  HTTPError,
  locks,
  tenancy,
  users,
} from "@budibase/backend-core"
import { features, groups } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import {
  EmailTemplatePurpose,
  LockName,
  LockType,
  type ContextUser,
  type InviteExistingUserToWorkspaceRequest,
  type User,
  type Workspace,
  type WorkspaceApp,
} from "@budibase/types"
import { sendEmail } from "../../utilities/email"
import { checkSlashesInUrl } from "../../utilities"

export const setWorkspaceRole = ({
  user,
  workspaceId,
  role,
}: {
  user: User
  workspaceId: string
  role?: string
}) => {
  if (role) {
    user.roles[workspaceId] = role
  } else {
    delete user.roles[workspaceId]
  }

  const creatorForApps = Object.entries(user.roles)
    .filter(([_appId, role]) => role === "CREATOR")
    .map(([appId]) => appId)

  if (user.builder?.creator || creatorForApps.length) {
    user.builder ??= {}
    user.builder.creator = true
    user.builder.apps = creatorForApps
  } else {
    delete user.builder?.creator
    delete user.builder?.apps
  }
}

const hasWorkspaceAccess = async ({
  user,
  workspaceId,
}: {
  user: User
  workspaceId: string
}) => {
  if (users.isAdminOrBuilder(user, workspaceId) || user.roles[workspaceId]) {
    return true
  }
  const userGroups = await groups.getBulk(user.userGroups || [], {
    enriched: false,
  })
  return userGroups.some(
    group =>
      !!group.roles?.[workspaceId] || group.builder?.apps?.includes(workspaceId)
  )
}

export const inviteExistingUserToWorkspace = async ({
  userId,
  workspaceId,
  inviter,
  role,
  groups: groupIds = [],
  admin,
}: InviteExistingUserToWorkspaceRequest & {
  userId: string
  workspaceId: string
  inviter: ContextUser
}) => {
  const prodWorkspaceId = dbCore.getProdWorkspaceID(workspaceId)
  const devWorkspaceId = dbCore.getDevWorkspaceID(workspaceId)

  const { result } = await locks.doWithLock(
    {
      type: LockType.AUTO_EXTEND,
      name: LockName.PROCESS_USER_INVITE,
      resource: userId,
    },
    async () => {
      const workspace = await context.doInWorkspaceContext(devWorkspaceId, () =>
        context
          .getWorkspaceDB()
          .get<Workspace>(dbCore.DocumentType.WORKSPACE_METADATA)
      )
      if (workspace.tenantId !== tenancy.getTenantId()) {
        throw new HTTPError("Workspace not found", 404)
      }

      let user = await users.getById(userId)
      const hadAccess = await hasWorkspaceAccess({
        user,
        workspaceId: prodWorkspaceId,
      })
      const groupIdsToAdd = [...new Set(groupIds)].filter(
        groupId => !user.userGroups?.includes(groupId)
      )
      if ((admin || groupIdsToAdd.length) && !users.isAdmin(inviter)) {
        throw new HTTPError(
          "Only admins can change organisation roles or groups",
          403
        )
      }
      if (groupIdsToAdd.length) {
        if (!(await features.isUserGroupsEnabled())) {
          throw new HTTPError("User groups are not enabled", 403)
        }
        for (const groupId of groupIdsToAdd) {
          const group = await groups.get(groupId)
          if (group.scimInfo?.isSync) {
            throw new HTTPError("Group not found", 404)
          }
        }
        for (const groupId of groupIdsToAdd) {
          await groups.addUsers(groupId, [userId])
        }
        user = await users.getById(userId)
      }
      if (admin) {
        user.admin = { global: true }
        user.builder = { global: true }
      }
      if (role) {
        setWorkspaceRole({ user, workspaceId: prodWorkspaceId, role })
      }
      if (role || admin) {
        user = await users.UserDB.save(user, {
          currentUserId: inviter._id,
          hashPassword: false,
        })
      }

      if (
        !hadAccess &&
        (await hasWorkspaceAccess({ user, workspaceId: prodWorkspaceId }))
      ) {
        try {
          const settings = await configs.getSettingsConfig()
          const groupBuilderApps = await groups.getGroupBuilderAppIds(user, {
            appId: prodWorkspaceId,
          })
          let path = "/builder/apps"
          if (
            users.isAdminOrBuilder(user, prodWorkspaceId) ||
            groupBuilderApps.includes(prodWorkspaceId)
          ) {
            path = `/builder/workspace/${devWorkspaceId}/home`
          } else {
            const publishedAppPath = await context.doInWorkspaceContext(
              prodWorkspaceId,
              async () => {
                const db = context.getWorkspaceDB()
                const publishedWorkspace = await db.tryGet<Workspace>(
                  dbCore.DocumentType.WORKSPACE_METADATA
                )
                if (!publishedWorkspace?.url) {
                  return
                }
                const apps = await db.allDocs<WorkspaceApp>(
                  dbCore.getWorkspaceAppParams(null, { include_docs: true })
                )
                const app = apps.rows
                  .map(row => row.doc!)
                  .find(app => !app.disabled)
                if (app) {
                  return `/app${publishedWorkspace.url}${app.url}`
                }
              }
            )
            if (publishedAppPath) {
              path = publishedAppPath
            }
          }
          await sendEmail(
            user.email,
            EmailTemplatePurpose.WORKSPACE_INVITATION,
            {
              subject: "You've been added to {{ workspaceName }}",
              user,
              workspaceInvitation: {
                inviterName: helpers.getUserLabel(inviter),
                workspaceName: workspace.name,
                workspaceUrl: checkSlashesInUrl(
                  tenancy.addTenantToUrl(`${settings.platformUrl}${path}`)
                ),
              },
            }
          )
        } catch (error) {
          console.log("Failed to send workspace invitation email", error)
        }
      }

      return { _id: user._id!, _rev: user._rev!, email: user.email }
    }
  )
  return result
}
