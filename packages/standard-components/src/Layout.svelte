<script>
  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")
  export let type = "mainSidebar"
  export let gap = "16px"

  let layoutMap = {
    mainSidebar: 2,
    sidebarMain: 2,
    twoColumns: 2,
    threeColumns: 3,
  }
</script>

<div
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}
  class={type}
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
    grid-template-columns: 2fr 1fr;
  }
  .sidebarMain {
    grid-template-columns: 1fr 2fr;
  }
  .twoColumns {
    grid-template-columns: 1fr 1fr;
  }
  .threeColumns {
    grid-template-columns: 1fr 1fr 1fr;
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
