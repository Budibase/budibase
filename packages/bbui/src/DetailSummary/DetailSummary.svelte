<script>
  import Icon from "../Icon/Icon.svelte"

  export let name
  export let initiallyShow = false
  export let collapsible = true
  export let padded = true

  let show = initiallyShow

  const onHeaderClick = () => {
    if (!collapsible) {
      return
    }
    show = !show
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="property-group-container">
  {#if name}
    <div
      class="property-group-name"
      on:click={onHeaderClick}
      class:padded
      class:open={show || !collapsible}
    >
      <div class="name">{name}</div>
      {#if collapsible}
        <Icon size="S" name={show ? "minus" : "plus"} />
      {/if}
    </div>
  {/if}
  <div
    class="property-panel"
    class:show={show || !collapsible}
    class:no-title={!name}
    class:padded
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
    color: var(--spectrum-global-color-gray-800);
    transition: color 130ms ease-in-out;
  }

  .property-group-name.open {
    padding-bottom: var(--spacing-m);
  }

  .property-group-name.padded {
    padding: var(--spacing-m) var(--spacing-xl);
  }

  .property-group-name:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .name {
    text-align: left;
    font-size: var(--spectrum-global-dimension-font-size-100);
    color: var(--spectrum-global-color-gray-900);
    letter-spacing: -0.02em;
    font-weight: 500;
    line-height: 20px;
    font-size: 14px;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
  }

  .property-panel {
    display: none;
  }

  .property-panel.padded {
    padding: var(--spacing-s) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
  }

  .property-panel.no-title {
    padding-top: var(--spacing-xl);
  }

  .show {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
</style>
