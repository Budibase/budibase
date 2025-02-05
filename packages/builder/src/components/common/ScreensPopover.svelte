<script lang="ts">
  import { List, ListItem, ActionButton } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { appStore } from "@/stores/builder"
  import type { ScreenUsage } from "@budibase/types"
  import { PopoverAlign } from "@budibase/types"

  export let screens: ScreenUsage[] = []
  export let icon = "DeviceDesktop"
  export let accentColor: string | undefined = undefined
  export let showCount = false
  export let align = PopoverAlign.Left

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
      selected={open || (showCount && screens.length)}
      {accentColor}
      on:click={show}
    >
      Screens{showCount && screens.length ? `: ${screens.length}` : ""}
    </ActionButton>
  </svelte:fragment>

  {#if !screens.length}
    <div class="empty-state">
      <p>No screens are using this data.</p>
    </div>
  {:else}
    <p class="description">The following screens are connected to this data.</p>
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

<style>
  .description {
    font-size: var(--font-size-s);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .empty-state {
    padding: var(--spacing-m);
    text-align: center;
    color: var(--grey-5);
    font-size: var(--font-size-s);
  }
</style>
