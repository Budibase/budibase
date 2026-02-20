<script>
  import { users } from "@/stores/portal/users"
  import { roles } from "@/stores/builder"
  import { Constants } from "@budibase/frontend-core"

  export let row

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

  $: globalRoleValue = users.getUserRole(row)
  $: workspaceRoleValue = getRoleFromWorkspaceRole(row?.workspaceRole)
  $: roleValue =
    canWorkspaceRoleOverrideGlobalRole(globalRoleValue) && workspaceRoleValue
      ? workspaceRoleValue
      : globalRoleValue
  $: role = Constants.ExtendedBudibaseRoleOptions.find(
    x => x.value === roleValue
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
    const customRole = availableRoles.find(x => x._id === roleId)
    return customRole?.uiMetadata?.displayName || customRole?.name || roleId
  }
  $: value =
    role?.value === Constants.BudibaseRoles.AppUser && row?.workspaceRole
      ? isBuiltInEndUserRole(row.workspaceRole)
        ? `${role.label}: ${getWorkspaceRoleLabel(row.workspaceRole, $roles)}`
        : getWorkspaceRoleLabel(row.workspaceRole, $roles)
      : role?.label || "Not available"
  $: groupUserValue = row?.workspaceRoleGroupRole
    ? `Group user: ${getWorkspaceRoleLabel(row.workspaceRoleGroupRole, $roles)}`
    : "Group user"
  $: tooltip = role?.subtitle || ""
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
