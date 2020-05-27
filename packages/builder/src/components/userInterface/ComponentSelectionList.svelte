<script>
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
    toggleTab()
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
  .tabs {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0 auto;
    padding: 0 30px;
    border-bottom: 1px solid #d8d8d8;

    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14px;
  }

  li {
    color: #808192;
    margin: 0 5px;
    padding: 0 8px;
    cursor: pointer;
  }

  .panel {
    padding: 20px;
  }

  .active {
    border-bottom: solid 3px #0055ff;
    color: #393c44;
  }
</style>
