<svelte:options runes={true} />

<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { roles } from "@/stores/builder"
  import { capitalise } from "@/helpers"

  interface Props {
    value: string
    row: {
      __skeleton?: boolean
    }
  }

  let { value, row }: Props = $props()

  const role = $derived($roles.find(x => x._id === value))

  const getRoleLabel = (roleId: string) => {
    return roleId === Constants.Roles.CREATOR
      ? capitalise(Constants.Roles.CREATOR.toLowerCase())
      : role?.uiMetadata.displayName || role?.name || "Custom role"
  }
</script>

{#if !row?.__skeleton}
  {#if value === Constants.Roles.GROUP}
    Controlled by group
  {:else if value === Constants.Roles.CREATOR}
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
{/if}
