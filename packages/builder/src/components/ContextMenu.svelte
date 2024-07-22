<script>
  import { contextMenuStore } from "stores/builder"
  import { Popover, Menu, MenuItem } from "@budibase/bbui"

  let dropdown
  let anchor
  let subMenuAnchor

  const getSubMenuItems = (contextMenu) => {
    return contextMenu.items?.[contextMenu.subMenuIndex]?.children ?? []
  }

  $: subMenuItems = getSubMenuItems($contextMenuStore)

  const handleKeyDown = () => {
    if ($contextMenuStore.visible) {
      contextMenuStore.close()
    }
  }

  const handleItemClick = async itemCallback => {
    await itemCallback()
    contextMenuStore.close()
  }

  $: console.log(dropdown?.clientWidth);
</script>

<svelte:window on:keydown={handleKeyDown} />
{#key $contextMenuStore.position}
  <div
    bind:this={anchor}
    class="anchor"
    style:top={`${$contextMenuStore.position.y}px`}
    style:left={`${$contextMenuStore.position.x}px`}
  />
  <div
    bind:this={subMenuAnchor}
    class="subMenuAnchor"
    style:top={`${$contextMenuStore.position.y + (($contextMenuStore.subMenuIndex ?? 0) * 32)}px`}
    style:left={`${$contextMenuStore.position.x + dropdown?.clientWidth ?? 0}px`}
  />
{/key}

<Popover
  open={$contextMenuStore.visible}
  animate={false}
  
  {anchor}
  resizable={false}
  align="left"
  on:close={contextMenuStore.close}
>
  <div class="dropdown" bind:this={dropdown}>
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
  </div>
</Popover>

<Popover
  open={$contextMenuStore.visible && subMenuItems.length > 0}
  animate={false}
  anchor={subMenuAnchor}
  resizable={false}
  align="left"
  on:close={contextMenuStore.close}
>
  <Menu>
    {#each subMenuItems as item}
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

<style>
  .dropdown :global(ul){
    width: 100%;
  }
  .anchor {
    z-index: 100;
    position: absolute;
    width: 0;
    height: 0;
  }

  .subMenuAnchor {
    z-index: 100;
    position: absolute;
  }
</style>
