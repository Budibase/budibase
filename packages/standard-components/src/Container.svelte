<script>
  import { getContext } from "svelte"

  const { styleable, transition, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let direction = "column"
  export let hAlign = "left"
  export let vAlign = "top"
  export let size = "shrink"

  let element
</script>

<div
  class={`
    container
    hAlign-${hAlign}
    vAlign-${vAlign}
    direction-${direction}
    size-${size}
  `}
  class:empty={!$component.children && $builderStore.inBuilder}
  class:selected={$component.selected}
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}
  bind:this={element}
>
  {#if !$component.children && $builderStore.inBuilder}
    <div class="placeholder">Add some content</div>
  {:else}
    <slot />
  {/if}
</div>

<style>
  .container {
    display: flex;
  }
  .empty {
    border: 2px dashed rgba(0, 0, 0, 0.25);
  }
  .direction-row {
    flex-direction: row;
  }
  .direction-column {
    flex-direction: column;
  }

  .size-shrink {
    flex: 0 1 auto;
  }
  .size-grow {
    flex: 1 1 0;
  }

  .direction-row.hAlign-left,
  .direction-column.vAlign-top {
    justify-content: flex-start;
  }
  .direction-row.hAlign-middle,
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
  .direction-column.hAlign-middle {
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

  .selected {
    position: relative;
  }
  .placeholder {
    padding: 20px;
    color: #888;
  }
</style>
