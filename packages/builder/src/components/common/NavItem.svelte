<script>
  export let icon
  export let withArrow = false
  export let withActions = true
  export let indentLevel = 0
  export let text
  export let border = true
  export let selected = false
  export let opened = false
  export let draggable = false
</script>

<div
  class="nav-item"
  class:border
  class:selected
  style={`padding-left: ${indentLevel * 18}px`}
  {draggable}
  on:dragend
  on:dragstart
  on:dragover
  on:drop
  on:click
  ondragover="return false"
  ondragenter="return false">
  <div class="content">
    {#if withArrow}
      <div class:opened class="icon arrow">
        <i class="ri-arrow-right-s-line" />
      </div>
    {/if}
    {#if icon}
      <div class="icon"><i class={icon} /></div>
    {/if}
    <div class="text">{text}</div>
    {#if withActions}
      <div class="actions">
        <slot />
      </div>
    {/if}
  </div>
</div>

<style>
  .nav-item {
    cursor: pointer;
    color: var(--grey-7);
  }
  .nav-item.border {
    border-top: 1px solid var(--grey-1);
  }
  .nav-item.selected {
    background-color: var(--grey-2);
    color: var(--ink);
  }
  .nav-item:hover {
    background-color: var(--grey-1);
  }
  .nav-item:hover .actions {
    display: flex;
  }
  .nav-item:hover,
  .nav-item.selected {
    border-radius: var(--border-radius-m);
  }

  .content {
    padding: 0 var(--spacing-m);
    height: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .icon {
    font-size: 16px;
    flex: 0 0 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .icon.arrow {
    margin: 0 -2px 0 -6px;
    font-size: 12px;
  }
  .icon.arrow.opened {
    transform: rotate(90deg);
  }
  .icon + .icon {
    margin-left: -4px;
  }

  .text {
    flex: 1 1 auto;
    font-weight: 500;
    font-size: var(--font-size-xs);
  }

  .actions {
    display: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
