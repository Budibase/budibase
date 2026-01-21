<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { API } from "@/api"
  import { type WorkspaceFavourite } from "@budibase/types"
  import { workspaceFavouriteStore } from "@/stores/builder"

  export let favourite: WorkspaceFavourite | undefined = undefined
  export let size: "S" | "XS" | "M" | "L" | "XL" | "XXL" | "XXXL" = "XS"

  let waiting = false
</script>

{#if favourite}
  <Icon
    name="star"
    hoverable
    weight={favourite._id ? "fill" : "regular"}
    color={favourite._id
      ? "var(--spectrum-global-color-yellow-1000)"
      : undefined}
    hoverColor={favourite._id
      ? "var(--spectrum-global-color-yellow-700)"
      : undefined}
    {size}
    on:click={async e => {
      e.stopPropagation()
      e.preventDefault()
      waiting = true
      try {
        if (favourite._id && favourite._rev) {
          await API.workspace.delete(favourite._id, favourite._rev)
        } else {
          await API.workspace.create({
            resourceId: favourite.resourceId,
            resourceType: favourite.resourceType,
          })
        }
        await workspaceFavouriteStore.sync()
      } catch (e) {
        console.error("Workspace favourite update failed", e)
      }
      waiting = false
    }}
    disabled={waiting}
  />
{/if}
