<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import components from "./temporaryPanelStructure.js"
  import { DropdownMenu } from "@budibase/bbui"
  import Tab from "./ItemTab/Tab.svelte"

  const categories = components.categories
  let selectedIndex
  let anchors = []
  let popover
  $: anchor = selectedIndex === -1 ? null : anchors[selectedIndex]

  const close = () => {
    popover.hide()
  }

  const onCategoryChosen = (category, idx) => {
    if (category.isCategory) {
      selectedIndex = idx
      popover.show()
    } else {
      onComponentChosen(category)
    }
  }

  const onComponentChosen = (component) => {
    store.addChildComponent(component._component, component.presetProps)
    const path = store.getPathToComponent($store.currentComponentInfo)
    $goto(`./:page/:screen/${path}`)
    close()
  }
</script>

<div class="container">
  {#each categories as category, idx}
    <div
      bind:this={anchors[idx]}
      class="category"
      on:click={() => onCategoryChosen(category, idx)}
      class:active={idx === selectedIndex}>
      {#if category.icon}<i class={category.icon} />{/if}
      <span>{category.name}</span>
      {#if category.isCategory}<i class="ri-arrow-down-s-line arrow" />{/if}
    </div>
  {/each}
</div>
<DropdownMenu
  on:close={() => (selectedIndex = null)}
  bind:this={popover}
  {anchor}
  align="left">
  <Tab
    list={categories[selectedIndex]}
    on:selectItem={(e) => onComponentChosen(e.detail)} />
</DropdownMenu>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    z-index: 1;
    height: 24px;
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
</style>
