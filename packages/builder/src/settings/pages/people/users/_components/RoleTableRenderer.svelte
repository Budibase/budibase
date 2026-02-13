<script>
  import { users } from "@/stores/portal/users"
  import { roles } from "@/stores/builder"
  import { Constants } from "@budibase/frontend-core"

  export let row

  $: role = Constants.ExtendedBudibaseRoleOptions.find(
    x => x.value === users.getUserRole(row)
  )
  const isBuiltInEndUserRole = roleId =>
    roleId === Constants.Roles.BASIC || roleId === Constants.Roles.ADMIN
  const getWorkspaceRoleLabel = roleId => {
    if (!roleId || roleId === Constants.Roles.BASIC) {
      return "Basic"
    }
    if (roleId === Constants.Roles.ADMIN) {
      return "Admin"
    }
    const customRole = $roles.find(x => x._id === roleId)
    return customRole?.uiMetadata?.displayName || customRole?.name || roleId
  }
  $: value =
    role?.value === Constants.BudibaseRoles.AppUser && row?.workspaceRole
      ? isBuiltInEndUserRole(row.workspaceRole)
        ? `${role.label}: ${getWorkspaceRoleLabel(row.workspaceRole)}`
        : getWorkspaceRoleLabel(row.workspaceRole)
      : role?.label || "Not available"
  $: tooltip = role?.subtitle || ""
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation title={tooltip}>
  {value}
</div>
