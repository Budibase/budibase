<script>
  import { ActionButton, List, ListItem, Button } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { screenStore, appStore } from "@/stores/builder"
  import { getContext, createEventDispatcher } from "svelte"

  const { datasource } = getContext("grid")
  const dispatch = createEventDispatcher()

  let popover

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
  $: connectedScreens = findConnectedScreens($screenStore.screens, resourceId)
  $: screenCount = connectedScreens.length

  const findConnectedScreens = (screens, resourceId) => {
    return screens.filter(screen => {
      return JSON.stringify(screen).includes(`"${resourceId}"`)
    })
  }

  const generateScreen = () => {
    popover?.hide()
    dispatch("generate")
  }
</script>

<DetailPopover title="Screens" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="WebPage"
      selected={open || screenCount}
      quiet
      accentColor="#364800"
    >
      Screens{screenCount ? `: ${screenCount}` : ""}
    </ActionButton>
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
          showArrow
        />
      {/each}
    </List>
  {/if}
  <div>
    <Button secondary icon="WebPage" on:click={generateScreen}>
      Generate app screen
    </Button>
  </div>
</DetailPopover>
