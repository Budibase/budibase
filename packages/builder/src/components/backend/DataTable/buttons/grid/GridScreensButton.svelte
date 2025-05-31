<script lang="ts">
  import { Button } from "@budibase/bbui"
  import ScreensPopover from "@/components/common/ScreensPopover.svelte"
  import { screenStore } from "@/stores/builder"
  import { getContext, createEventDispatcher } from "svelte"
  import type { Screen, ScreenUsage } from "@budibase/types"
  const dispatch = createEventDispatcher()

  const { datasource }: { datasource: any } = getContext("grid")

  let popover: any

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
  $: connectedScreens = findConnectedScreens($screenStore.screens, resourceId)
  $: screenUsage = connectedScreens.map(
    (screen: Screen): ScreenUsage => ({
      url: screen.routing?.route,
      _id: screen._id!,
    })
  )

  const findConnectedScreens = (
    screens: Screen[],
    resourceId: string
  ): Screen[] => {
    return screens.filter(screen => {
      return JSON.stringify(screen).includes(`"${resourceId}"`)
    })
  }

  const generateScreen = () => {
    popover?.hide()
    dispatch("generate")
  }
</script>

<ScreensPopover
  bind:this={popover}
  screens={screenUsage}
  icon="browser"
  accentColor="#364800"
  showCount
>
  <svelte:fragment slot="footer">
    <Button secondary icon="browser" on:click={generateScreen}>
      Generate app screen
    </Button>
  </svelte:fragment>
</ScreensPopover>
