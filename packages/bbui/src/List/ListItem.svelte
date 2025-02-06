<script>
  import Icon from "../Icon/Icon.svelte"
  import StatusLight from "../StatusLight/StatusLight.svelte"

  export let icon = null
  export let iconColor = null
  export let title = null
  export let subtitle = null
  export let url = null
  export let hoverable = false
  export let showArrow = false
  export let selected = false
</script>

<a
  href={url}
  class="list-item"
  class:hoverable={hoverable || url != null}
  class:large={!!subtitle}
  on:click
  class:selected
>
  <div class="list-item__left">
    {#if icon === "StatusLight"}
      <StatusLight square size="L" color={iconColor} />
    {:else if icon}
      <div class="list-item__icon">
        <Icon name={icon} color={iconColor} size={subtitle ? "XL" : "M"} />
      </div>
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
  <div class="list-item__right">
    <slot name="right" />
    {#if showArrow}
      <Icon name="ChevronRight" />
    {/if}
  </div>
</a>

<style>
  .list-item {
    padding: var(--spacing-m) var(--spacing-l);
    background: var(--spectrum-global-color-gray-75);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background 130ms ease-out, border-color 130ms ease-out;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-800);
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
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
  }
  .hoverable:not(.selected):hover {
    background: var(--spectrum-global-color-gray-200);
    border-color: var(--spectrum-global-color-gray-400);
  }
  .selected {
    background: var(--spectrum-global-color-blue-100);
  }

  /* Selection is only meant for standalone list items (non stacked) so we just set a fixed border radius */
  .list-item.selected {
    background-color: var(--spectrum-global-color-blue-100);
    border-color: var(--spectrum-global-color-blue-100);
  }
  .list-item.selected:after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    border: 1px solid var(--spectrum-global-color-blue-400);
    pointer-events: none;
    top: 0;
    left: 0;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 1;
    opacity: 0.5;
  }

  /* Large icons */
  .list-item.large .list-item__icon {
    background-color: var(--spectrum-global-color-gray-200);
    padding: 4px;
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background-color 130ms ease-out, border-color 130ms ease-out,
      color 130ms ease-out;
  }
  .list-item.large.hoverable:not(.selected):hover .list-item__icon {
    background-color: var(--spectrum-global-color-gray-300);
  }
  .list-item.large.selected .list-item__icon {
    background-color: var(--spectrum-global-color-blue-400);
    color: white;
    border-color: var(--spectrum-global-color-blue-100);
  }

  /* Internal layout */
  .list-item__left,
  .list-item__right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-m);
  }
  .list-item.large .list-item__left,
  .list-item.large .list-item__right {
    gap: var(--spacing-m);
  }
  .list-item__left {
    width: 0;
    flex: 1 1 auto;
  }
  .list-item__right {
    flex: 0 0 auto;
    color: var(--spectrum-global-color-gray-600);
  }

  /* Text */
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
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
</style>
