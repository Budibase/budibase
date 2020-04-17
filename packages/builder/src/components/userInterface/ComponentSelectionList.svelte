<script>
  // This should be fetched from somewhere in the future, rather than be hardcoded.
  import components from "./temporaryPanelStructure.js"
  import Tab from "./ComponentTab/Tab.svelte"

  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import { store } from "builderStore"
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
  import { ImageIcon, InputIcon, LayoutIcon } from "components/common/Icons/"
  import Select from "components/common/Select.svelte"
  import Button from "components/common/PlusButton.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    getRecordNodes,
    getIndexNodes,
    getIndexSchema,
    pipe,
  } from "components/common/core"

  export let toggleTab

  const categories = components.categories
  let selectedCategory = categories[0]

  let componentLibraries = []
  let current_view = "text"
  let selectedComponent = null
  let selectedLib
  let selectTemplateDialog
  let templateInstances = []
  let selectedTemplateInstance

  $: templatesByComponent = groupBy(t => t.component)($store.templates)
  $: hierarchy = $store.hierarchy
  $: libraryModules = $store.libraries
  $: standaloneTemplates = pipe(templatesByComponent, [
    values,
    flatten,
    filter(t => !$store.components.some(c => c.name === t.component)),
    map(t => ({ name: splitName(t.component).componentName, template: t })),
    uniqBy(t => t.name),
  ])

  const addRootComponent = (component, allComponents) => {
    const { libName } = splitName(component.name)
    let group = find(r => r.libName === libName)(allComponents)

    if (!group) {
      group = {
        libName,
        components: [],
      }

      allComponents.push(group)
    }

    group.components.push(component)
  }

  const onComponentChosen = component => {
    if (component.template) {
      onTemplateChosen(component.template)
    } else {
      store.addChildComponent(component.name)
      toggleTab()
    }
  }

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

  function generate_components_list(components) {
    return ($store.currentFrontEndType === "page"
      ? $store.builtins.concat(components)
      : components
    ).concat(standaloneTemplates)
  }

  $: {
    const newComponentLibraries = []

    for (let comp of sortBy(["name"])($store.components)) {
      addRootComponent(comp, newComponentLibraries)
    }

    componentLibraries = newComponentLibraries
    if (!selectedLib) selectedLib = newComponentLibraries[0].libName
  }

  $: componentLibrary = componentLibraries.find(l => l.libName === selectedLib)
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
    <Tab components={selectedCategory.components} />
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

  .template-instance-label {
    margin-left: 20px;
  }
</style>
