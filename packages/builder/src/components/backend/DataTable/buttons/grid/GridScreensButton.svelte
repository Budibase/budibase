<script>
  import { ActionButton } from "@budibase/bbui"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import { screenStore } from "stores/builder"
  import { getContext } from "svelte"

  const { datasource } = getContext("grid")

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
  $: connectedScreens = findConnectedScreens($screenStore.screens, resourceId)

  const findConnectedScreens = (screens, resourceId) => {
    console.log(resourceId)
    return screens.filter(screen => {
      return JSON.stringify(screen).includes(`"${resourceId}"`)
    })
  }

  $: console.log(connectedScreens)
</script>

<DetailPopover title="Screens">
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="WebPage" selected={open} quiet>Screens</ActionButton>
  </svelte:fragment>
  The following screens are connected to this data:
  {connectedScreens.map(screen => screen.routing.route)}
</DetailPopover>
