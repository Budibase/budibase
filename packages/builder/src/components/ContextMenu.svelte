<script lang="ts">
  import { contextMenuStore } from "@/stores/builder"
  import {
    AbsTooltip,
    Menu,
    MenuItem,
    Popover,
    TooltipPosition,
  } from "@budibase/bbui"
  import NewPill from "./common/NewPill.svelte"

  let dropdown
  let anchor

  const handleKeyDown = () => {
    if ($contextMenuStore.visible) {
      contextMenuStore.close()
    }
  }

  const handleItemClick = async (itemCallback: () => void | Promise<void>) => {
    await itemCallback()
    contextMenuStore.close()
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
{#key $contextMenuStore.position}
  <div
    bind:this={anchor}
    class="anchor"
    style:top={`${$contextMenuStore.position.y}px`}
    style:left={`${$contextMenuStore.position.x}px`}
  />
{/key}

<Popover
  open={$contextMenuStore.visible}
  animate={false}
  bind:this={dropdown}
  {anchor}
  resizable={false}
  align="left"
  on:close={contextMenuStore.close}
>
  <Menu>
    {#each $contextMenuStore.items as item}
      {#if item.visible}
        <AbsTooltip text={item.tooltip} position={TooltipPosition.Right}>
          <MenuItem
            icon={item.icon}
            iconWeight={item.iconWeight}
            iconColour={item.iconColour}
            keyBind={item.keyBind ?? undefined}
            on:click={() => handleItemClick(item.callback)}
            disabled={item.disabled}
          >
            {item.name}
            <div slot="right">
              {#if item.isNew}
                <NewPill />
              {/if}
            </div>
          </MenuItem>
        </AbsTooltip>
      {/if}
    {/each}
  </Menu>
</Popover>

<style>
  .anchor {
    z-index: 100;
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
