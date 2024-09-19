<script>
  import Icon from "../Icon/Icon.svelte"

  export let icon = null
  export let iconColor = null
  export let title = null
  export let subtitle = null
  export let url = null
  export let hoverable = false
  export let showArrow = false
</script>

<a
  href={url}
  class="list-item"
  class:hoverable={hoverable || url != null}
  on:click
>
  <div class="left">
    {#if icon}
      <Icon name={icon} color={iconColor} />
    {/if}
    <div class="list-item__text">
      {#if title}
        <div class="list-item__title">
          {title}
        </div>
      {/if}
      {#if subtitle}
        <div class="list-item__subtitle">
          {subtitle}
        </div>
      {/if}
    </div>
  </div>
  <div class="right">
    <slot name="right" />
    {#if showArrow}
      <Icon name="ChevronRight" />
    {/if}
  </div>
</a>

<style>
  .list-item {
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-75);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background 130ms ease-out;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-800);
  }
  .list-item:not(:first-child) {
    border-top: none;
  }
  .list-item:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .list-item:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .hoverable:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }

  .left,
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-l);
  }
  .left {
    width: 0;
    flex: 1 1 auto;
  }
  .right {
    flex: 0 0 auto;
    color: var(--spectrum-global-color-gray-600);
  }

  .list-item__text {
    flex: 1 1 auto;
    width: 0;
  }
  .list-item__title,
  .list-item__subtitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list-item__subtitle {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
