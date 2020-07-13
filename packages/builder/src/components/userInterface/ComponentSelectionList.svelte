<script>
  import { goto } from "@sveltech/routify"
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import components from "./temporaryPanelStructure.js"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import CategoryTab from "./CategoryTab.svelte"
  import {
    find,
    sortBy,
    groupBy,
    values,
    filter,
    map,
    uniqBy,
    flatten,
  } from "lodash/fp"

  import { pipe } from "components/common/core"

  import Tab from "./ItemTab/Tab.svelte"
  import { store } from "builderStore"

  export let toggleTab

  let selectTemplateDialog
  let selectedTemplateInstance
  let templateInstances = []

  let selectedComponent = null

  const categories = components.categories
  let selectedCategory = categories[0]

  const onComponentChosen = component => {
    store.addChildComponent(component._component)

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
