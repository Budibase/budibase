<script>
  import { StatusLight } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { roles } from "@/stores/builder"
  import { capitalise } from "@/helpers"

  export let value

  $: role = $roles.find(x => x._id === value)

  const getRoleLabel = roleId => {
    return roleId === Constants.Roles.CREATOR
      ? capitalise(Constants.Roles.CREATOR.toLowerCase())
      : role?.uiMetadata.displayName || role?.name || "Custom role"
  }
</script>

{#if value === Constants.Roles.CREATOR}
  Can edit
{:else}
  <StatusLight
    square
    color={role?.uiMetadata.color ||
      "var(--spectrum-global-color-static-magenta-400)"}
  >
    Can use as {getRoleLabel(value)}
  </StatusLight>
{/if}
