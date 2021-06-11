<script>
  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")
  export let type = "mainSidebar"
  export let gap = "16px"
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
  in:transition={{ type: $component.transition }}
  class="{type} columns-{columnsDependingOnSize}"
  use:styleable={$component.styles}
>
  <slot />
  {#if layoutMap[type] - $component.children > 0}
    {#each new Array(layoutMap[type] - $component.children) as _}
      <p><i class="ri-image-line" />Add some components to display.</p>
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

  p {
    background-color: var(--grey-3);
    color: var(--grey-6);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    display: grid;
    place-items: center;
  }
  p i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--grey-5);
  }
</style>
