<script>
  import { ActionButton, List, ListItem } from "@budibase/bbui"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import { screenStore, appStore } from "stores/builder"
  import { getContext } from "svelte"

  const { datasource } = getContext("grid")

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
  $: connectedScreens = findConnectedScreens($screenStore.screens, resourceId)

  const findConnectedScreens = (screens, resourceId) => {
    return screens.filter(screen => {
      return JSON.stringify(screen).includes(`"${resourceId}"`)
    })
  }
</script>

<DetailPopover title="Screens" minWidth={400}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="WebPage" selected={open} quiet>Screens</ActionButton>
  </svelte:fragment>
  {#if !connectedScreens.length}
    There aren't any screens connected to this data.
  {:else}
    The following screens are connected to this data.
    <List>
      {#each connectedScreens as screen}
        <ListItem
          title={screen.routing.route}
          url={`/builder/app/${$appStore.appId}/design/${screen._id}`}
        />
      {/each}
    </List>
  {/if}
</DetailPopover>
