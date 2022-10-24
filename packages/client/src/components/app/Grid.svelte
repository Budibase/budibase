<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  const cols = 12

  let node
  $: coords = generateCoords(cols)

  const generateCoords = num => {
    let grid = []
    for (let row = 0; row < num; row++) {
      for (let col = 0; col < num; col++) {
        grid.push({ row, col })
      }
    }
    return grid
  }
</script>

<div
  bind:this={node}
  class="grid"
  use:styleable={$component.styles}
  data-cols={cols}
>
  <div class="underlay">
    {#each coords as coord}
      <div class="placeholder" />
    {/each}
  </div>
  <slot />
</div>

<style>
  .grid {
    position: relative;
    height: 400px;
  }
  .grid,
  .underlay {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
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
