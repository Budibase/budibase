<script>
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import components from "./temporaryPanelStructure.js"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
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

  import {
    getRecordNodes,
    getIndexNodes,
    getIndexSchema,
    pipe,
  } from "components/common/core"

  import Tab from "./ComponentTab/Tab.svelte"
  import { store } from "builderStore"

  export let toggleTab

  let selectTemplateDialog
  let selectedTemplateInstance
  let templateInstances = []

  let selectedComponent = null

  const categories = components.categories
  let selectedCategory = categories[0]

  const onTemplateChosen = template => {
    selectedComponent = null
    const { componentName, libName } = splitName(template.name)
    const templateOptions = {
      records: getRecordNodes(hierarchy),
      indexes: getIndexNodes(hierarchy),
      helpers: {
        indexSchema: getIndexSchema(hierarchy),
      },
    }

    templateInstances = libraryModules[libName][componentName](templateOptions)
    if (!templateInstances || templateInstances.length === 0) return
    selectedTemplateInstance = templateInstances[0].name
    selectTemplateDialog.show()
  }

  const onTemplateInstanceChosen = () => {
    selectedComponent = null
    const instance = templateInstances.find(
      i => i.name === selectedTemplateInstance
    )
    store.addTemplatedComponent(instance.props)
    toggleTab()
  }

  $: templatesByComponent = groupBy(t => t.component)($store.templates)
  $: hierarchy = $store.hierarchy
  $: libraryModules = $store.libraries
  $: standaloneTemplates = pipe(
    templatesByComponent,
    [
      values,
      flatten,
      filter(t => !$store.components.some(c => c.name === t.component)),
      map(t => ({ name: splitName(t.component).componentName, template: t })),
      uniqBy(t => t.name),
    ]
  )
</script>

<div class="root">
  <ul class="tabs">
    {#each categories as category}
      <li
        on:click={() => (selectedCategory = category)}
        class:active={selectedCategory === category}>
        {category.name}
      </li>
    {/each}
  </ul>
  <div class="panel">
    <Tab list={selectedCategory} {onTemplateChosen} />
  </div>
</div>

<ConfirmDialog
  bind:this={selectTemplateDialog}
  title="Choose Template"
  onCancel={() => (selectedComponent = null)}
  onOk={onTemplateInstanceChosen}>
  {#each templateInstances.map(i => i.name) as instance}
    <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
      <label>
        <input
          class="uk-radio"
          type="radio"
          bind:group={selectedTemplateInstance}
          value={instance} />
        <span class="template-instance-label">{instance}</span>
      </label>
    </div>
  {/each}
</ConfirmDialog>

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
