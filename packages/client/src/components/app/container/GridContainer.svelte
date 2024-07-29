<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")

  export let cols = 12
  export let rows = 12

  $: cols = cols || 12
  $: rows = rows || 12
  $: coords = generateCoords(rows, cols)

  const generateCoords = (rows, cols) => {
    let grid = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid.push({ row, col })
      }
    }
    return grid
  }
</script>

<div
  class="grid"
  use:styleable={{
    ...$component.styles,
    normal: {
      ...$component.styles?.normal,
      "--cols": cols,
      "--rows": rows,
      gap: "0 !important",
    },
  }}
  data-rows={rows}
  data-cols={cols}
>
  {#if $builderStore.inBuilder}
    <div class="underlay">
      {#each coords as _}
        <div class="placeholder" />
      {/each}
    </div>
  {/if}
  <slot />
</div>

<style>
  /*
    Ensure all children of containers which are top level children of
    grids do not overflow
  */
  :global(.grid > .component > .valid-container > .component > *) {
    max-height: 100%;
    max-width: 100%;
  }

  /* Ensure all top level children have some grid styles set */
  :global(.grid > .component > *) {
    overflow: hidden;
    width: auto;
    height: auto;
    grid-column-start: min(
      max(1, var(--grid-column-start)),
      var(--cols)
    ) !important;
    grid-column-end: min(
      max(2, var(--grid-column-end)),
      calc(var(--cols) + 1)
    ) !important;
    grid-row-start: min(max(1, var(--grid-row-start)), var(--rows)) !important;
    grid-row-end: min(
      max(2, var(--grid-row-end)),
      calc(var(--rows) + 1)
    ) !important;
    max-height: 100%;
    max-width: 100%;
  }
  .grid {
    position: relative;
    height: 400px;
  }
  .grid,
  .underlay {
    display: grid;
    grid-template-rows: repeat(var(--rows), 1fr);
    grid-template-columns: repeat(var(--cols), 1fr);
  }
  .underlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    grid-gap: 2px;
    background-color: var(--spectrum-global-color-gray-200);
    border: 2px solid var(--spectrum-global-color-gray-200);
  }
  .underlay {
    z-index: -1;
  }
  .placeholder {
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
