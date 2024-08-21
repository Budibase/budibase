<script>
  import { Popover, Icon } from "@budibase/bbui"

  export let title
  export let align = "left"

  let popover
  let anchor
  let open

  export const show = () => popover?.show()
  export const hide = () => popover?.hide()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="anchor" bind:this={anchor} on:click={show}>
  <slot name="anchor" {open} />
</div>

<Popover bind:this={popover} bind:open {anchor} {align} minWidth={300}>
  <div class="detail-popover">
    <div class="detail-popover__header">
      <div class="detail-popover__title">
        {title}
      </div>
      <Icon name="Close" />
    </div>
    <div class="detail-popover__body">
      <slot />
    </div>
  </div>
</Popover>

<style>
  .detail-popover {
    --padding: var(--spacing-l);
    background-color: var(--spectrum-alias-background-color-primary);
  }
  .detail-popover__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    padding: var(--padding);
  }
  .detail-popover__title {
    font-size: 16px;
    font-weight: 600;
  }
  .detail-popover__body {
    padding: var(--padding);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--padding);
  }
</style>
