<script>
  import { getContext } from "svelte"
  import { fade } from "svelte/transition"

  const component = getContext("component")
  const { styleable, builderStore } = getContext("sdk")

  $: coords = generateCoords(12)

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

<div class="grid" use:styleable={$component.styles}>
  <div class="underlay">
    {#each coords as coord}
      <div class="placeholder" />
    {/each}
  </div>
  <slot />
  {#if $builderStore.isDragging}
    <div
      class="overlay"
      in:fade={{ duration: 130 }}
      out:fade|self={{ duration: 130 }}
    >
      {#each coords as coord}
        <div
          class="placeholder grid-coord"
          data-row={coord.row}
          data-col={coord.col}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .grid {
    position: relative;
    min-height: 400px;
  }
  .grid,
  .underlay,
  .overlay {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
  }
  .underlay,
  .overlay {
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
  .overlay {
    z-index: 999;
    background-color: var(--spectrum-global-color-gray-500);
    border-color: var(--spectrum-global-color-gray-500);
    opacity: 0.3;
  }

  .placeholder {
    background-color: var(--spectrum-global-color-gray-100);
  }
</style>
