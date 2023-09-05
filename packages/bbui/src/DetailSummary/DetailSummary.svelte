<script>
  import Icon from "../Icon/Icon.svelte"
  import { createEventDispatcher } from "svelte"

  export let name
  export let show = false
  export let collapsible = true

  const dispatch = createEventDispatcher()
  const onHeaderClick = () => {
    if (!collapsible) {
      return
    }
    show = !show
    if (show) {
      dispatch("open")
    }
  }
</script>

<div class="property-group-container">
  {#if name}
    <div class="property-group-name" on:click={onHeaderClick}>
      <div class="name">{name}</div>
      {#if collapsible}
        <Icon size="S" name={show ? "Remove" : "Add"} />
      {/if}
    </div>
  {/if}
  <div
    class="property-panel"
    class:show={show || !collapsible}
    class:no-title={!name}
  >
    <slot />
  </div>
</div>

<style>
  .property-group-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-bottom: var(--border-light);
  }
  .property-group-container:last-child {
    border-bottom: 0px;
  }
  .property-group-name {
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
    transition: color 130ms ease-in-out;
  }
  .property-group-name:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .name {
    text-align: left;
    font-size: var(--font-size-s);
    font-weight: 600;
    letter-spacing: 0.14px;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
  }

  .property-panel {
    display: none;
    padding: var(--spacing-s) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
  }
  .property-panel.no-title {
    padding: var(--spacing-xl);
  }

  .show {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
</style>
