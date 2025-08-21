<script lang="ts">
  import { onMount } from "svelte"

  import { screenStore } from "@/stores/builder"
  import ScreensPopover from "@/components/common/ScreensPopover.svelte"
  import type { ScreenUsage } from "@budibase/types"

  export let sourceId: string

  let screens: ScreenUsage[] = []
  let popover: any

  export function show() {
    popover?.show()
  }

  export function hide() {
    popover?.hide()
  }

  onMount(async () => {
    let response = await screenStore.usageInScreens(sourceId)
    screens = response?.screens
  })
</script>

<ScreensPopover
  bind:this={popover}
  {screens}
  icon="browser"
  accentColor="#364800"
  showCount
/>
