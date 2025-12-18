<script>
  export let icon
  export let title
  export let subtitle = undefined
  export let disabled = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="dropdown-item" class:disabled on:click {...$$restProps}>
  {#if icon}<i class={icon} />{/if}
  <div class="content">
    <div class="title">{title}</div>
    {#if subtitle != null}
      <div class="subtitle">{subtitle}</div>
    {/if}
  </div>
</div>

<style>
  .dropdown-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-l);
    color: var(--ink);
  }
  .dropdown-item.disabled,
  .dropdown-item.disabled .subtitle {
    pointer-events: none;
    color: var(--grey-5);
  }
  .dropdown-item:not(.disabled):hover {
    background-color: var(--grey-2);
    cursor: pointer;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .title,
  .subtitle {
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .title {
    font-weight: 600;
  }

  .subtitle {
    color: var(--grey-7);
    font-weight: 400;
  }

  i {
    font-size: var(--font-size-m);
  }
</style>
