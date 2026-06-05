<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let direction
  export let hAlign
  export let vAlign
  export let size
  export let gap
  export let wrap
  export let onClick

  $: directionClass = direction ? `flex-container direction-${direction}` : ""
  $: hAlignClass = hAlign ? `hAlign-${hAlign}` : ""
  $: vAlignClass = vAlign ? `vAlign-${vAlign}` : ""
  $: sizeClass = size ? `size-${size}` : ""
  $: isCustomGap = gap && typeof gap === "object"
  $: gapClass = gap && !isCustomGap ? `gap-${gap}` : ""
  $: customGapStyle = isCustomGap
    ? `--custom-column-gap: ${gap?.column || "0"}; --custom-row-gap: ${gap?.row || "0"};`
    : ""
  $: classNames = [
    directionClass,
    hAlignClass,
    vAlignClass,
    sizeClass,
    gapClass,
    isCustomGap ? "custom-gap" : "",
  ]
    .filter(Boolean)
    .join(" ")

  // Merge custom gap styles with component styles to avoid conflicts with styleable action
  $: enrichedStyles = {
    ...$component.styles,
    custom: ($component.styles?.custom || "") + customGapStyle,
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={classNames}
  class:clickable={!!onClick}
  use:styleable={enrichedStyles}
  class:wrap
  on:click={onClick}
>
  <slot />
</div>

<style>
  .flex-container {
    display: flex;
    max-width: 100%;
  }
  .flex-container :global(.component > *) {
    max-width: 100%;
  }
  .direction-row {
    flex-direction: row;
  }
  .direction-column {
    flex-direction: column;
  }

  /* Grow containers inside a row need 0 width 0 so that they ignore content */
  /* The nested selector for data-type is the wrapper around all components */
  .direction-row :global(> .component > .size-grow) {
    width: 0;
  }

  .size-shrink {
    flex: 0 1 auto;
  }
  .size-grow {
    flex: 1 1 auto;
  }

  .direction-row.hAlign-left,
  .direction-column.vAlign-top {
    justify-content: flex-start;
  }
  .direction-row.hAlign-center,
  .direction-column.vAlign-middle {
    justify-content: center;
  }
  .direction-row.hAlign-right,
  .direction-column.vAlign-bottom {
    justify-content: flex-end;
  }
  .direction-row.hAlign-stretch,
  .direction-column.vAlign-stretch {
    justify-content: space-between;
  }
  .direction-row.hAlign-space-around,
  .direction-column.vAlign-space-around {
    justify-content: space-around;
  }

  .direction-row.vAlign-top,
  .direction-column.hAlign-left {
    align-items: flex-start;
  }
  .direction-row.vAlign-middle,
  .direction-column.hAlign-center {
    align-items: center;
  }
  .direction-row.vAlign-bottom,
  .direction-column.hAlign-right {
    align-items: flex-end;
  }
  .direction-row.vAlign-stretch,
  .direction-column.hAlign-stretch {
    align-items: stretch;
  }

  .gap-S {
    gap: 8px;
  }
  .gap-M {
    gap: 16px;
  }
  .gap-L {
    gap: 32px;
  }

  .custom-gap {
    column-gap: var(--custom-column-gap, 0);
    row-gap: var(--custom-row-gap, 0);
  }

  .wrap {
    flex-wrap: wrap;
  }
  .clickable {
    cursor: pointer;
  }
  .clickable :global(*) {
    pointer-events: none;
  }
</style>
