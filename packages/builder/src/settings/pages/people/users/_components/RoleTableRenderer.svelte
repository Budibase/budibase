<svelte:options runes={true} />

<script>
  import { users } from "@/stores/portal/users"
  import { roles } from "@/stores/builder"
  import { Constants } from "@budibase/frontend-core"

  let { row } = $props()

  const getRoleFromWorkspaceRole = workspaceRole => {
    if (workspaceRole === Constants.Roles.CREATOR) {
      return Constants.BudibaseRoles.Creator
    }
    if (workspaceRole) {
      return Constants.BudibaseRoles.AppUser
    }
    return undefined
  }

  const canWorkspaceRoleOverrideGlobalRole = globalRole => {
    return (
      globalRole === Constants.BudibaseRoles.AppUser ||
      globalRole === Constants.BudibaseRoles.Creator
    )
  }

  const globalRoleValue = $derived(users.getUserRole(row))
  const workspaceRoleValue = $derived(
    getRoleFromWorkspaceRole(row?.workspaceRole)
  )
  const roleValue = $derived(
    canWorkspaceRoleOverrideGlobalRole(globalRoleValue) && workspaceRoleValue
      ? workspaceRoleValue
      : globalRoleValue
  )
  const role = $derived(
    Constants.ExtendedBudibaseRoleOptions.find(x => x.value === roleValue)
  )
  const isBuiltInEndUserRole = roleId =>
    roleId === Constants.Roles.BASIC || roleId === Constants.Roles.ADMIN
  const getWorkspaceRoleLabel = (roleId, availableRoles) => {
    if (!roleId || roleId === Constants.Roles.BASIC) {
      return "Basic"
    }
    if (roleId === Constants.Roles.ADMIN) {
      return "Admin"
    }
    if (roleId === Constants.Roles.CREATOR) {
      return "Can edit"
    }
    const customRole = availableRoles.find(x => x._id === roleId)
    return customRole?.uiMetadata?.displayName || customRole?.name || roleId
  }
  const value = $derived(
    role?.value === Constants.BudibaseRoles.AppUser && row?.workspaceRole
      ? isBuiltInEndUserRole(row.workspaceRole)
        ? `${role.label}: ${getWorkspaceRoleLabel(row.workspaceRole, $roles)}`
        : getWorkspaceRoleLabel(row.workspaceRole, $roles)
      : role?.label || "Not available"
  )
  const groupUserValue = $derived(
    row?.workspaceRoleGroupRole
      ? `Group user: ${getWorkspaceRoleLabel(row.workspaceRoleGroupRole, $roles)}`
      : "Group user"
  )
  const tooltip = $derived(role?.subtitle || "")
</script>

{#if row?.workspaceRole === Constants.Roles.GROUP}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click|stopPropagation title={groupUserValue}>
    {groupUserValue}
  </div>
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click|stopPropagation title={tooltip}>
    {value}
  </div>
{/if}
