<script>
  import { contextMenuStore } from "stores/builder"
  import { Popover, Menu, MenuItem } from "@budibase/bbui"

  let dropdown
  let anchor

  const showDropdown = dropdown => {
    dropdown?.show()
  }

  $: showDropdown(dropdown)

  const handleKeyDown = () => {
    if ($contextMenuStore.visible) {
      contextMenuStore.close()
    }
  }

  const handleItemClick = async itemCallback => {
    await itemCallback()
    contextMenuStore.close()
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
<div
  bind:this={anchor}
  class="anchor"
  style:top={`${$contextMenuStore.position.y}px`}
  style:left={`${$contextMenuStore.position.x}px`}
/>

{#key $contextMenuStore.position}
  {#if $contextMenuStore.visible}
    <Popover
      bind:this={dropdown}
      {anchor}
      resizable={false}
      align="left"
      on:close={contextMenuStore.close}
    >
      <Menu>
        {#each $contextMenuStore.items as item}
          {#if item.visible}
            <MenuItem
              icon={item.icon}
              keyBind={item.keyBind}
              on:click={() => handleItemClick(item.callback)}
              disabled={item.disabled}
            >
              {item.name}
            </MenuItem>
          {/if}
        {/each}
      </Menu>
    </Popover>
  {/if}
{/key}

<style>
  .anchor {
    z-index: 100;
    position: absolute;
    width: 0;
    height: 0;
  }
</style>
