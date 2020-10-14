<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import components from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"

  import Tab from "./ItemTab/Tab.svelte"

  export let toggleTab

  const categories = components.categories
  let selectedCategory = categories[0]

  const onComponentChosen = component => {
    store.addChildComponent(component._component, component.presetProps)

    toggleTab("Navigate")

    // Get ID path
    const path = store.getPathToComponent($store.currentComponentInfo)

    // Go to correct URL
    $goto(`./:page/:screen/${path}`)
  }
</script>

<div class="root">
  <CategoryTab
    onClick={category => (selectedCategory = category)}
    {selectedCategory}
    {categories} />

  <div class="panel">
    <Tab
      list={selectedCategory}
      on:selectItem={e => onComponentChosen(e.detail)}
      {toggleTab} />
  </div>
</div>

<style>
  .panel {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
</style>
