<script>
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import { store } from "../builderStore"
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
  import { ImageIcon, InputIcon, LayoutIcon } from "../common/Icons/"
  import Select from "../common/Select.svelte"
  import Button from "../common/PlusButton.svelte"
  import ConfirmDialog from "../common/ConfirmDialog.svelte"
  import {
    getRecordNodes,
    getIndexNodes,
    getIndexSchema,
    pipe,
  } from "../common/core"

  export let toggleTab

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
  <Select on:change={e => (selectedLib = e.target.value)}>
    {#each componentLibraries as lib}
      <option value={lib.libName}>{lib.libName}</option>
    {/each}
  </Select>

  <div class="library-container">
    <!-- <ul>
      <li>
        <button
          class:selected={current_view === 'text'}
          on:click={() => (current_view = 'text')}>
          <InputIcon />
        </button>
      </li>
      <li>
        <button
          class:selected={current_view === 'layout'}
          on:click={() => (current_view = 'layout')}>
          <LayoutIcon />
        </button>
      </li>
      <li>
        <button
          class:selected={current_view === 'media'}
          on:click={() => (current_view = 'media')}>
          <ImageIcon />
        </button>
      </li>
    </ul> -->

    {#if componentLibrary}
      {#each generate_components_list(componentLibrary.components) as component}
        <div class="component-container">
          <div class="component" on:click={() => onComponentChosen(component)}>
            <div class="name">{splitName(component.name).componentName}</div>
            {#if (component.presets || templatesByComponent[component.name]) && component.name === selectedComponent}
              <ul class="preset-menu">
                {#if component.presets}
                  <span>{splitName(component.name).componentName} Presets</span>
                  {#each Object.keys(component.presets) as preset}
                    <li
                      on:click|stopPropagation={() => onComponentChosen(component, preset)}>
                      {preset}
                    </li>
                  {/each}
                {/if}
                {#if templatesByComponent[component.name]}
                  <span>
                    {splitName(component.name).componentName} Templates
                  </span>
                  {#each templatesByComponent[component.name] as template}
                    <li
                      on:click|stopPropagation={() => onTemplateChosen(template)}>
                      {template.description}
                    </li>
                  {/each}
                {/if}
              </ul>
            {/if}
          </div>
          {#if component.presets || templatesByComponent[component.name]}
            <Button
              on:click={() => {
                selectedComponent = selectedComponent ? null : component.name
              }}>
              <span
                class="open-presets"
                class:open={selectedComponent === component.name}>
                ...
              </span>
            </Button>
          {/if}
        </div>
      {/each}
    {/if}
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
  .root {
    display: flex;
    flex-direction: column;
  }

  .library-container {
    padding: 0 0 10px 0;
    flex: 1 1 auto;
    min-height: 0px;
    margin-top: 20px;
  }

  .component-container {
    display: flex;
    align-items: center;
  }

  .component {
    position: relative;
    padding: 0 15px;
    cursor: pointer;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    margin: 5px 0;
    height: 40px;
    box-sizing: border-box;
    color: #163057;
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 5px;
  }

  .component:hover {
    background-color: var(--lightslate);
  }

  .component > .name {
    color: #163057;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.6;
  }

  ul {
    list-style: none;
    display: flex;
    padding: 0;
  }

  .preset-menu {
    flex-direction: column;
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    z-index: 1;
    background: #fafafa;
    padding: 10px;
    border-radius: 2px;
    color: rgba(22, 48, 87, 0.6);
  }

  .preset-menu > span {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .preset-menu li {
    font-size: 14px;
    margin-top: 13px;
  }

  .preset-menu li:hover {
    font-weight: bold;
  }

  li {
    margin-right: 20px;
    background: none;
    border-radius: 5px;
  }

  /* li button {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    border-radius: 5px;
    padding: 12px;
    outline: none;
    cursor: pointer;
  } */

  /* .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  } */

  .open {
    color: rgba(0, 85, 255, 1);
  }

  .template-instance-label {
    margin-left: 20px;
  }
</style>
