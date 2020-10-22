<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import components from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import { Popover } from "@budibase/bbui"
  import { fade, fly } from "svelte/transition"

  import Tab from "./ItemTab/Tab.svelte"

  const categories = components.categories
  let selectedCategory
  let width

  const close = () => {
    selectedCategory = null
  }

  const onCategoryChosen = (category) => {
    if (category.isCategory) {
      selectedCategory = selectedCategory === category ? null : category
    } else {
      onComponentChosen(category)
    }
  }

  const onComponentChosen = (component) => {
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
    class:open={selectedCategory != null}>
    {#each categories as category, idx}
      <div
        class="category"
        on:click={() => onCategoryChosen(category)}
        class:active={selectedCategory === category}>
        {#if category.icon}<i class={category.icon} />{/if}
        <span>{category.name}</span>
        {#if category.isCategory}<i class="ri-arrow-down-s-line arrow" />{/if}
      </div>
    {/each}
  </div>
  {#if selectedCategory != null}
    <div class="overlay" on:click={close} />
    <div class="dropdown" transition:fly={{ y: -120 }}>
      <Tab
        list={selectedCategory}
        on:selectItem={(e) => onComponentChosen(e.detail)} />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    z-index: 1;
  }

  .container {
    padding: var(--spacing-l) 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    z-index: 1;
    width: calc(100% - 80px);
    overflow: hidden;
  }
  .container.open {
  }

  .category {
    color: var(--grey-7);
    cursor: pointer;
    margin-right: var(--spacing-l);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
  .category span {
    font-weight: 500;
    user-select: none;
  }
  .category.active,
  .category:hover {
    color: var(--ink);
  }
  .category i:not(:last-child) {
    font-size: 16px;
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
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.05);
  }
</style>
