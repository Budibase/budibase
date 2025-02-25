<script>
  import { Icon, Popover } from "@budibase/bbui"
  import GroupBadge from "./GroupBadge.svelte"

  export let groups = []

  let anchor, popover

  function show() {
    popover.show()
  }

  function hide() {
    popover.hide()
  }
</script>

<div class="icon" bind:this={anchor}>
  <Icon name="More" size="S" hoverable on:mouseover={show} on:mouseleave={hide} />
</div>

<Popover
  customZIndex={1002}
  bind:this={popover}
  align="center"
  {anchor}
  showPopover={true}
  minWidth={0}
>
  <div class="badges">
    {#each groups as group}
      <GroupBadge color={group.color} name={group.name} />
    {/each}
  </div>
</Popover>

<style>
  .icon {
    height: auto;
    display: flex;
    justify-content: center;
  }
  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
</style>
