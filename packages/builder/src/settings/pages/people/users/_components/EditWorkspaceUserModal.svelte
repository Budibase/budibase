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
  import { createEventDispatcher } from "svelte"

  interface UserDraft {
    firstName: string
    lastName: string
    email: string
    role: string
    appRole: string
  }

  export let user: User | null = null
  export let workspaceId = ""
  export let readonly = false
  export let isTenantOwner = false

  const dispatch = createEventDispatcher()
  const builtInEndUserRoles = [Constants.Roles.BASIC, Constants.Roles.ADMIN]
  const excludedRoleIds = [
    ...builtInEndUserRoles,
    Constants.Roles.PUBLIC,
    Constants.Roles.POWER,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]
  let roleColorLookup: Record<string, string | undefined> = {}
  $: roleColorLookup = ($roles || []).reduce<
    Record<string, string | undefined>
  >((acc, role) => {
    acc[role._id] = role.uiMetadata?.color
    return acc
  }, {})

  let draft: UserDraft = {
    firstName: "",
    lastName: "",
    email: "",
    role: Constants.BudibaseRoles.AppUser,
    appRole: Constants.Roles.BASIC,
  }
  let initialDraft: UserDraft | null = null
  let selectedUserId: string | null = null

  $: customEndUserRoleOptions = ($roles || [])
    .filter(role => !excludedRoleIds.includes(role._id))
    .map(role => ({
      label: role.uiMetadata?.displayName || role.name || "Custom role",
      value: role._id,
      color:
        role.uiMetadata?.color ||
        "var(--spectrum-global-color-static-magenta-400)",
    }))
  $: endUserRoleOptions = [
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
    ...customEndUserRoleOptions,
  ]
  $: roleOptions = isTenantOwner
    ? Constants.ExtendedBudibaseRoleOptions
    : Constants.BudibaseRoleOptions
  $: disableFields = readonly || !!user?.scimInfo?.isSync
  $: disableRole =
    disableFields || isTenantOwner || user?._id === $auth.user?._id
  $: isEndUser = draft.role === Constants.BudibaseRoles.AppUser
  $: hasChanges =
    !!initialDraft &&
    (draft.firstName !== initialDraft.firstName ||
      draft.lastName !== initialDraft.lastName ||
      draft.role !== initialDraft.role ||
      draft.appRole !== initialDraft.appRole)
  $: if (!endUserRoleOptions.some(option => option.value === draft.appRole)) {
    draft = { ...draft, appRole: Constants.Roles.BASIC }
  }

  $: if (user?._id && user._id !== selectedUserId) {
    selectedUserId = user._id
    draft = createDraft(user)
    initialDraft = { ...draft }
  }

  const createDraft = (user: User): UserDraft => {
    const role = users.getUserRole(user)
    return {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: isTenantOwner ? "owner" : role,
      appRole: user.roles?.[workspaceId] || Constants.Roles.BASIC,
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

      if (!disableRole) {
        if (draft.role === Constants.BudibaseRoles.AppUser) {
          await users.addUserToWorkspace(user._id, draft.appRole, updated._rev)
        } else if (updated.roles?.[workspaceId]) {
          await users.removeUserFromWorkspace(user._id, updated._rev)
        }
      }

      notifications.success("User updated successfully")
      dispatch("saved")
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
        bind:value={draft.role}
        options={roleOptions}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        getOptionSubtitle={(option: any) => option.subtitle}
        showSelectedSubtitle={true}
        disabled={disableRole}
      />
    </div>
    {#if isEndUser}
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
