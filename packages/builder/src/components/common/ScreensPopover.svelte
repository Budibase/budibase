<script lang="ts">
  import {
    List,
    ListItem,
    ActionButton,
    PopoverAlignment,
  } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { appStore, workspaceAppStore } from "@/stores/builder"
  import type { ScreenUsage } from "@budibase/types"

  export let screens: ScreenUsage[] = []
  export let icon = "desktop"
  export let accentColor: string | null | undefined = null
  export let showCount = false
  export let align = PopoverAlignment.Left

  let popover: DetailPopover

  $: screensByApp = screens.reduce<Record<string, ScreenUsage[]>>(
    (acc, screen) => {
      acc[screen.workspaceAppId] ??= []
      acc[screen.workspaceAppId].push(screen)

      return acc
    },
    {}
  )

  $: hasManyWorkspaceApps = $workspaceAppStore.workspaceApps.length > 1

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
    {#each Object.entries(screensByApp) as [workspaceAppId, appScreens]}
      {@const title = !hasManyWorkspaceApps
        ? undefined
        : $workspaceAppStore.workspaceApps.find(a => a._id === workspaceAppId)
            ?.name}
      <List {title}>
        {#each appScreens as screen}
          <ListItem
            title={screen.url}
            url={`/builder/workspace/${$appStore.appId}/design/${screen._id}`}
            showArrow
          />
        {/each}
      </List>
    {/each}
  {/if}

  <slot name="footer" />
</DetailPopover>
