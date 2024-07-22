<script>
  import { contextMenuStore } from "stores/builder"
  import { Popover, Menu, MenuItem } from "@budibase/bbui"

  let anchor
  let secondaryMenuAnchor
  let tertiaryMenuAnchor

  let dropdown
  let secondaryDropdown

  let clicked = false

  const getSecondaryMenuItems = (contextMenu) => {
    return contextMenu.items?.[contextMenu.hoverIndex]?.children ?? []
  }

  const getTertiaryMenuItems = (contextMenu, secondaryMenuItems) => {
    return secondaryMenuItems?.[contextMenu.secondaryHoverIndex]?.children ?? []
  }

  $: secondaryMenuItems = getSecondaryMenuItems($contextMenuStore)
  $: tertiaryMenuItems = getTertiaryMenuItems($contextMenuStore, secondaryMenuItems)

  const handleKeyDown = () => {
    if ($contextMenuStore.visible) {
      contextMenuStore.close()
    }
  }

  const handleItemClick = async itemCallback => {
    clicked = true;
    await itemCallback()
    clicked = false;

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
  <div
    bind:this={secondaryMenuAnchor}
    class="secondaryMenuAnchor"
    style:top={`${$contextMenuStore.position.y + (($contextMenuStore.hoverIndex ?? 0) * 32)}px`}
    style:left={`${$contextMenuStore.position.x + (dropdown?.clientWidth ?? 0) + 6}px`}
  />
  <div
    bind:this={secondaryMenuAnchor}
    class="secondaryMenuAnchor"
    style:top={`${$contextMenuStore.position.y + (($contextMenuStore.hoverIndex ?? 0) * 32)}px`}
    style:left={`${$contextMenuStore.position.x + (dropdown?.clientWidth ?? 0) + 6}px`}
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
      {#each $contextMenuStore.items as item, index}
        {#if item.visible}
          <MenuItem
            on:mouseenter={() => contextMenuStore.setHoverIndex(index)}
            forceHover={$contextMenuStore.hoverIndex === index && !item.disabled && !clicked}
            icon={item.icon}
            iconRight={item.children?.length > 0 ? 'ChevronRight' : null}
            keyBind={item.keyBind}
            on:click={() => handleItemClick(item.callback)}
            disabled={clicked || item.disabled}
          >
            {item.name}
          </MenuItem>
        {/if}
      {/each}
    </Menu>
  </div>
</Popover>

<Popover
  open={$contextMenuStore.visible && secondaryMenuItems.length > 0}
  animate={false}
  anchor={secondaryMenuAnchor}
  resizable={false}
  align="left"
  on:close={contextMenuStore.close}
>
  <div class="dropdown" bind:this={secondaryDropdown}>
    <Menu>
      {#each secondaryMenuItems as item, index}
        {#if item.visible}
          <MenuItem
            on:mouseenter={() => contextMenuStore.setSecondaryHoverIndex(index)}
            forceHover={$contextMenuStore.secondaryHoverIndex === index && !item.disabled && !clicked}
            icon={item.icon}
            iconRight={item.children?.length > 0 ? 'ChevronRight' : null}
            keyBind={item.keyBind}
            on:click={() => handleItemClick(item.callback)}
            disabled={clicked || item.disabled}
          >
            {item.name}
          </MenuItem>
        {/if}
      {/each}
    </Menu>
  </div>
</Popover>

<Popover
  open={$contextMenuStore.visible && tertiaryMenuItems.length > 0}
  animate={false}
  anchor={tertiaryMenuAnchor}
  resizable={false}
  align="left"
  on:close={contextMenuStore.close}
>
  <Menu>
    {#each tertiaryMenuItems as item}
      {#if item.visible}
        <MenuItem
          icon={item.icon}
          keyBind={item.keyBind}
          on:click={() => handleItemClick(item.callback)}
          disabled={clicked || item.disabled}
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

  .secondaryMenuAnchor {
    z-index: 100;
    position: absolute;
  }
</style>
