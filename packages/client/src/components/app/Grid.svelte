<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")

  export let cols = 12
  export let rows = 12

  // Deliberately non-reactive as we want this fixed whenever the grid renders
  const defaultColSpan = Math.ceil((cols + 1) / 2)
  const defaultRowSpan = Math.ceil((rows + 1) / 2)

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
      "--default-col-span": defaultColSpan,
      "--default-row-span": defaultRowSpan,
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
    grid-column-start: 1;
    grid-column-end: var(--default-col-span);
    grid-row-start: 1;
    grid-row-end: var(--default-row-span);
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
