<script>
  import { StatusLight } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles } from "stores/builder"
  import { capitalise } from "helpers"
  import { BuiltInRole } from "@budibase/types"

  export let value

  const getRoleLabel = roleId => {
    const role = $roles.find(x => x._id === roleId)
    return roleId === BuiltInRole.CREATOR
      ? capitalise(BuiltInRole.CREATOR.toLowerCase())
      : role?.name || "Custom role"
  }
</script>

{#if value === BuiltInRole.CREATOR}
  Can edit
{:else}
  <StatusLight square color={RoleUtils.getRoleColour(value)}>
    Can use as {getRoleLabel(value)}
  </StatusLight>
{/if}
