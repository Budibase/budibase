<script>
  import { StatusLight } from "@budibase/bbui"
  import { RoleUtils, Constants } from "@budibase/frontend-core"
  import { roles } from "stores/builder"
  import { capitalise } from "helpers"

  export let value

  const getRoleLabel = roleId => {
    const role = $roles.find(x => x._id === roleId)
    return roleId === Constants.Roles.CREATOR
      ? capitalise(Constants.Roles.CREATOR.toLowerCase())
      : role?.name || "Custom role"
  }
</script>

{#if value === Constants.Roles.CREATOR}
  Can edit
{:else}
  <StatusLight square color={RoleUtils.getRoleColour(value)}>
    Can use as {getRoleLabel(value)}
  </StatusLight>
{/if}
