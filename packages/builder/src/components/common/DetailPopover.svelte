<script lang="ts">
  import { Popover, Icon } from "@budibase/bbui"
  import { PopoverAlign } from "@budibase/types"

  export let title: string = ""
  export let align: PopoverAlign = PopoverAlign.Left
  export let showPopover: boolean = true
  export let width: number = 400

  let popover: any
  let anchor: HTMLElement
  let open: boolean

  export const show = () => popover?.show()
  export const hide = () => popover?.hide()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="anchor" bind:this={anchor} on:click={show}>
  <slot name="anchor" {open} />
</div>

<Popover
  bind:this={popover}
  bind:open
  minWidth={width || 400}
  maxWidth={width || 400}
  {anchor}
  {align}
  {showPopover}
  on:open
  on:close
  customZindex={100}
>
  <div class="detail-popover">
    <div class="detail-popover__header">
      <div class="detail-popover__title">
        {title}
      </div>
      <Icon
        name="Close"
        hoverable
        color="var(--spectrum-global-color-gray-600)"
        hoverColor="var(--spectum-global-color-gray-900)"
        on:click={hide}
      />
    </div>
    <div class="detail-popover__body">
      <slot />
    </div>
  </div>
</Popover>

<style>
  .detail-popover {
    background-color: var(--spectrum-alias-background-color-primary);
  }
  .detail-popover__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    padding: var(--spacing-l) var(--spacing-xl);
  }
  .detail-popover__title {
    font-size: 16px;
    font-weight: 600;
  }
  .detail-popover__body {
    padding: var(--spacing-xl) var(--spacing-xl);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
</style>
