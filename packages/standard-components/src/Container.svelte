<script>
  import { getContext } from "svelte"

  const { styleable, transition, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let direction
  export let hAlign
  export let vAlign
  export let size

  $: directionClass = direction ? `valid-container direction-${direction}` : ""
  $: hAlignClass = hAlign ? `hAlign-${hAlign}` : ""
  $: vAlignClass = vAlign ? `vAlign-${vAlign}` : ""
  $: sizeClass = size ? `size-${size}` : ""
</script>

<div
  class={[directionClass, hAlignClass, vAlignClass, sizeClass].join(" ")}
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}
>
  <slot />
</div>

<style>
  .valid-container {
    display: flex;
    max-width: 100%;
  }
  .valid-container :global([data-type="component"] > *) {
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
  .direction-row :global(> [data-type="component"] > .size-grow) {
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
</style>
