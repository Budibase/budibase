<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import components from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import { Popover } from "@budibase/bbui"
  import { fade, fly } from "svelte/transition"

  import Tab from "./ItemTab/Tab.svelte"

  const categories = components.categories
  let selectedIndex
  let width
  $: selectedCategory = selectedIndex == null ? null : categories[selectedIndex]

  const close = () => {
    selectedIndex = null
  }

  const onComponentChosen = component => {
    store.addChildComponent(component._component, component.presetProps)

    // Get ID path
    const path = store.getPathToComponent($store.currentComponentInfo)

    // Go to correct URL
    $goto(`./:page/:screen/${path}`)
    close()
  }
</script>

<div class="wrapper">
  <div
    class="container"
    bind:clientWidth={width}
    class:border={selectedCategory == null}>
    {#each categories as category, idx}
      <div
        class="category"
        on:click={() => (selectedIndex = idx)}
        class:active={selectedCategory === category}>
        {category.name}
        <i class="ri-arrow-down-s-line" />
      </div>
    {/each}
  </div>
  {#if selectedCategory != null}
    <div class="overlay" on:click={close} />
    <div class="dropdown" transition:fly={{ y: -120 }}>
      <Tab
        list={selectedCategory}
        on:selectItem={e => onComponentChosen(e.detail)} />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    z-index: 1;
  }

  .container {
    padding: var(--spacing-xl) 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    z-index: 1;
  }
  .container.border {
    border-bottom: 1px solid var(--grey-2);
  }

  .category {
    color: var(--ink);
    cursor: pointer;
    margin-right: var(--spacing-xl);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-s);
    font-weight: 500;
  }
  .category.active,
  .category:hover {
    color: var(--blue);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -2;
    width: 100vw;
    height: 100vh;
  }

  .dropdown {
    position: absolute;
    z-index: -1;
    top: calc(100% - var(--spacing-xl));
    left: 0;
    width: calc(100% - 80px);
    background-color: white;
    padding: var(--spacing-xl) 40px;
    border-bottom: 1px solid var(--grey-2);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.05);
  }
</style>
