<script>
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let type = "mainSidebar"
  export let minSize = 250

  let layoutMap = {
    mainSidebar: 2,
    sidebarMain: 2,
    twoColumns: 2,
    threeColumns: 3,
  }

  let containerWidth
  $: columnsDependingOnSize = calculateColumns(containerWidth)

  function calculateColumns(parentWidth) {
    const numberOfAllowedColumns = Math.floor(parentWidth / minSize) || 100
    if (layoutMap[type] <= numberOfAllowedColumns) {
      return false
    } else if (layoutMap[type] > numberOfAllowedColumns) {
      return numberOfAllowedColumns
    }
  }
</script>

<div
  bind:clientWidth={containerWidth}
  class="{type} columns-{columnsDependingOnSize}"
  use:styleable={$component.styles}
>
  <slot />
  {#if layoutMap[type] - $component.children > 0}
    {#each new Array(layoutMap[type] - $component.children) as _}
      <div class:placeholder={$builderStore.inBuilder}>
        <Placeholder />
      </div>
    {/each}
  {/if}
</div>

<style>
  div {
    display: grid;
    grid-gap: 16px;
  }
  .mainSidebar {
    grid-template-columns: 3fr 1fr;
  }
  .sidebarMain {
    grid-template-columns: 1fr 3fr;
  }
  .twoColumns {
    grid-template-columns: 1fr 1fr;
  }
  .threeColumns {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .columns-1 {
    grid-template-columns: 1fr;
  }
  .columns-2 {
    grid-template-columns: 1fr 1fr;
  }
  .placeholder {
    border: 2px dashed var(--spectrum-global-color-gray-600);
    padding: var(--spacing-l);
  }
</style>
