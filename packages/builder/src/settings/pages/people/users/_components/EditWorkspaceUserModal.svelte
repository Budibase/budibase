<svelte:options runes={true} />

<script lang="ts">
  import {
    Input,
    Layout,
    ModalContent,
    Select,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { roles } from "@/stores/builder"
  import { auth, users } from "@/stores/portal"
  import type { User } from "@budibase/types"

  interface UserDraft {
    firstName: string
    lastName: string
    email: string
    role: string
    appRole: string
  }

  interface WorkspaceUser extends User {
    workspaceRole?: string
  }

  interface Props {
    user?: WorkspaceUser | null
    workspaceId: string
    readonly?: boolean
    isTenantOwner?: boolean
    onsaved?: () => void
  }

  let {
    user = null,
    workspaceId,
    readonly = false,
    isTenantOwner = false,
    onsaved,
  }: Props = $props()

  const builtInEndUserRoles = [Constants.Roles.BASIC, Constants.Roles.ADMIN]
  const excludedRoleIds = [
    ...builtInEndUserRoles,
    Constants.Roles.PUBLIC,
    Constants.Roles.POWER,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]

  const roleColorLookup = $derived(
    ($roles || []).reduce<Record<string, string | undefined>>((acc, role) => {
      acc[role._id] = role.uiMetadata?.color
      return acc
    }, {})
  )

  let draft = $state<UserDraft>({
    firstName: "",
    lastName: "",
    email: "",
    role: Constants.BudibaseRoles.AppUser,
    appRole: Constants.Roles.BASIC,
  })
  let initialDraft = $state<UserDraft | null>(null)
  let selectedUserId = $state<string | null>(null)

  const customEndUserRoleOptions = $derived(
    ($roles || [])
      .filter(role => !excludedRoleIds.includes(role._id))
      .map(role => ({
        label: role.uiMetadata?.displayName || role.name || "Custom role",
        value: role._id,
        color:
          role.uiMetadata?.color ||
          "var(--spectrum-global-color-static-magenta-400)",
      }))
  )
  const hasGroupMembership = $derived(
    Array.isArray(user?.userGroups) && user.userGroups.length > 0
  )
  const endUserRoleOptions = $derived([
    {
      label: "Basic user",
      value: Constants.Roles.BASIC,
      color: roleColorLookup[Constants.Roles.BASIC],
    },
    {
      label: "Admin user",
      value: Constants.Roles.ADMIN,
      color: roleColorLookup[Constants.Roles.ADMIN],
    },
    ...(hasGroupMembership
      ? [
          {
            label: "Controlled by group",
            value: Constants.Roles.GROUP,
            color: roleColorLookup[Constants.Roles.GROUP],
          },
        ]
      : []),
    ...customEndUserRoleOptions,
  ])
  const roleOptions = $derived(
    isTenantOwner
      ? Constants.ExtendedBudibaseRoleOptions
      : Constants.BudibaseRoleOptions
  )
  const disableFields = $derived(readonly || !!user?.scimInfo?.isSync)
  const disableRole = $derived(
    disableFields || isTenantOwner || user?._id === $auth.user?._id
  )
  const hasChanges = $derived(
    !!initialDraft &&
      (draft.firstName !== initialDraft.firstName ||
        draft.lastName !== initialDraft.lastName ||
        draft.role !== initialDraft.role ||
        draft.appRole !== initialDraft.appRole)
  )
  const hasRoleChanges = $derived(
    !!initialDraft &&
      (draft.role !== initialDraft.role ||
        draft.appRole !== initialDraft.appRole)
  )

  $effect(() => {
    if (user?._id && user._id !== selectedUserId) {
      selectedUserId = user._id
      draft = createDraft(user)
      initialDraft = { ...draft }
    }
  })

  const sanitizeAppRole = (appRole: string) => {
    if (appRole === Constants.Roles.GROUP && !hasGroupMembership) {
      return Constants.Roles.BASIC
    }
    const rolesLoaded = ($roles || []).length > 0
    if (
      rolesLoaded &&
      !endUserRoleOptions.some(option => option.value === appRole)
    ) {
      return Constants.Roles.BASIC
    }
    return appRole
  }

  const createDraft = (user: WorkspaceUser): UserDraft => {
    const role = users.getUserRole(user)
    const appRole =
      user.roles?.[workspaceId] ||
      (user.workspaceRole === Constants.Roles.GROUP
        ? Constants.Roles.GROUP
        : Constants.Roles.BASIC)
    return {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: isTenantOwner ? "owner" : role,
      appRole: sanitizeAppRole(appRole),
    }
  }

  const getRoleFlags = (role: string, currentUser: User) => {
    if (role === Constants.BudibaseRoles.Developer) {
      return { admin: { global: false }, builder: { global: true } }
    }
    if (role === Constants.BudibaseRoles.Admin) {
      return { admin: { global: true }, builder: { global: true } }
    }
    if (role === Constants.BudibaseRoles.Creator) {
      return {
        admin: { global: false },
        builder: {
          global: false,
          creator: true,
          apps: currentUser?.builder?.apps || [],
        },
      }
    }
    return {
      admin: { global: false },
      builder: { global: false, creator: false, apps: [] },
    }
  }

  const getWorkspaceRole = (role: string, appRole: string) => {
    if (role === Constants.BudibaseRoles.Creator) {
      return Constants.Roles.CREATOR
    }
    if (role === Constants.BudibaseRoles.Admin) {
      return Constants.Roles.ADMIN
    }
    if (role === Constants.BudibaseRoles.AppUser) {
      if (appRole === Constants.Roles.GROUP) {
        return undefined
      }
      return appRole || Constants.Roles.BASIC
    }
    return Constants.Roles.BASIC
  }

  const onConfirm = async () => {
    if (!user?._id || !hasChanges) {
      return
    }

    try {
      const current = await users.get(user._id)
      if (!current?._id || !current?._rev) {
        notifications.error("Error updating user")
        return keepOpen
      }

      const nameUpdates = {
        firstName: draft.firstName.trim() || undefined,
        lastName: draft.lastName.trim() || undefined,
      }
      const roleUpdates = disableRole ? {} : getRoleFlags(draft.role, current)
      await users.save({ ...current, ...nameUpdates, ...roleUpdates })

      const updated = await users.get(user._id)
      if (!updated?._rev) {
        notifications.error("Error updating user")
        return keepOpen
      }

      if (!disableRole && hasRoleChanges) {
        const appRole = sanitizeAppRole(draft.appRole)
        const desiredWorkspaceRole = getWorkspaceRole(draft.role, appRole)
        const currentWorkspaceRole = updated.roles?.[workspaceId]
        if (currentWorkspaceRole !== desiredWorkspaceRole) {
          if (desiredWorkspaceRole) {
            await users.addUserToWorkspace(
              user._id,
              desiredWorkspaceRole,
              updated._rev
            )
          } else {
            await users.removeUserFromWorkspace(user._id, updated._rev)
          }
        }
      }

      notifications.success("User updated successfully")
      onsaved?.()
    } catch (error) {
      console.error(error)
      notifications.error("Error updating user")
      return keepOpen
    }
  }
</script>

<ModalContent
  size="M"
  confirmText="Save user"
  cancelText="Cancel"
  showCloseIcon={false}
  {onConfirm}
  disabled={!hasChanges}
>
  <svelte:fragment slot="header">
    <span class="modal-title">
      <span>Edit workspace user</span>
    </span>
  </svelte:fragment>
  <Layout noPadding gap="S">
    <Input label="Email" value={draft.email} readonly />
    <Input
      label="First name"
      bind:value={draft.firstName}
      disabled={disableFields}
    />
    <Input
      label="Last name"
      bind:value={draft.lastName}
      disabled={disableFields}
    />
    <div class="role-select">
      <Select
        label="Select role"
        placeholder={false}
        bind:value={draft.role}
        options={roleOptions}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        getOptionSubtitle={(option: any) => option.subtitle}
        showSelectedSubtitle={true}
        disabled={disableRole}
      />
    </div>
    {#if draft.role === Constants.BudibaseRoles.AppUser}
      <div class="role-select-compact">
        <Select
          label="Select end user role"
          bind:value={draft.appRole}
          options={endUserRoleOptions}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          getOptionColour={option => option.color}
          placeholder={false}
          disabled={disableRole}
        />
      </div>
    {/if}
  </Layout>
</ModalContent>

<style>
  .modal-title {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  .role-select :global(.spectrum-Picker) {
    height: auto;
    align-items: center;
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
  }
</style>
