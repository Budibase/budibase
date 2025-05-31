<script lang="ts">
  import {
    Popover,
    Icon,
    PopoverAlignment,
    type PopoverAPI,
  } from "@budibase/bbui"

  export let title: string = ""
  export let subtitle: string | undefined = undefined
  export let align: PopoverAlignment = PopoverAlignment.Left
  export let showPopover: boolean = true
  export let width: number | undefined = undefined

  let popover: PopoverAPI | undefined
  let anchor: HTMLElement | undefined
  let open: boolean = false

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
  customZIndex={100}
>
  <div class="detail-popover">
    <div class="detail-popover__header">
      <div class="detail-popover__title">
        {title}
        <Icon
          name="x"
          hoverable
          color="var(--spectrum-global-color-gray-600)"
          hoverColor="var(--spectrum-global-color-gray-900)"
          on:click={hide}
          size="S"
        />
      </div>
      {#if subtitle}
        <div class="detail-popover__subtitle">{subtitle}</div>
      {/if}
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
    flex-direction: column;
    align-items: stretch;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    padding: var(--spacing-l) var(--spacing-xl);
    gap: var(--spacing-s);
  }
  .detail-popover__title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
