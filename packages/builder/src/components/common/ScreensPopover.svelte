<script lang="ts">
  import {
    List,
    ListItem,
    ActionButton,
    PopoverAlignment,
  } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { appStore } from "@/stores/builder"
  import type { ScreenUsage } from "@budibase/types"

  export let screens: ScreenUsage[] = []
  export let icon = "desktop"
  export let accentColor: string | null | undefined = null
  export let showCount = false
  export let align = PopoverAlignment.Left

  let popover: any

  export function show() {
    popover?.show()
  }

  export function hide() {
    popover?.hide()
  }
</script>

<DetailPopover title="Screens" bind:this={popover} {align}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      {icon}
      quiet
      selected={open || !!(showCount && screens.length)}
      {accentColor}
      on:click={show}
    >
      Screens{showCount && screens.length ? `: ${screens.length}` : ""}
    </ActionButton>
  </svelte:fragment>

  {#if !screens.length}
    There aren't any screens connected to this data.
  {:else}
    The following screens are connected to this data.
    <List>
      {#each screens as screen}
        <ListItem
          title={screen.url}
          url={`/builder/app/${$appStore.appId}/design/${screen._id}`}
          showArrow
        />
      {/each}
    </List>
  {/if}

  <slot name="footer" />
</DetailPopover>
