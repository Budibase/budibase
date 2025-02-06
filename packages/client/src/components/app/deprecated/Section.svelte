<script>
  import { getContext } from "svelte"
  import Placeholder from "../Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let type = "mainSidebar"
  export let minSize = 250

  let layoutMap = {
    mainSidebar: 2,
    sidebarMain: 2,
    oneColumn: 1,
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
    --gap: 16px;
    grid-gap: var(--gap);
  }
  .mainSidebar {
    grid-template-columns:
      calc((100% - var(--gap)) / 4 * 3) /* 75% */
      calc((100% - var(--gap)) / 4); /* 25% */
  }
  .sidebarMain {
    grid-template-columns:
      calc((100% - var(--gap)) / 4) /* 25% */
      calc((100% - var(--gap)) / 4 * 3); /* 75% */
  }
  .oneColumn,
  .columns-1 {
    grid-template-columns: 1fr;
  }
  .twoColumns,
  .columns-2 {
    grid-template-columns: repeat(2, calc((100% - var(--gap)) / 2));
  }
  .threeColumns {
    grid-template-columns: repeat(3, calc((100% - var(--gap)) / 3));
  }
  .placeholder {
    border: 2px dashed var(--spectrum-global-color-gray-600);
    padding: var(--spacing-l);
  }
</style>
