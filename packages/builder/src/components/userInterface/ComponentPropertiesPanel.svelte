<script>
  import { get } from "svelte/store"
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { FrontendTypes } from "constants"
  import panelStructure from "./temporaryPanelStructure.js"
  import CategoryTab from "./CategoryTab.svelte"
  import DesignView from "./DesignView.svelte"
  import SettingsView from "./SettingsView.svelte"

  let flattenedPanel = flattenComponents(panelStructure.categories)
  let categories = [
    { value: "settings", name: "Settings" },
    { value: "design", name: "Design" },
  ]
  let selectedCategory = categories[0]

  $: componentInstance =
    $store.currentView !== "component"
      ? { ...$currentAsset, ...$selectedComponent }
      : $selectedComponent
  $: componentDefinition = $store.components[componentInstance._component]
  $: componentPropDefinition =
    flattenedPanel.find(
      // use for getting controls for each component property
      c => c._component === componentInstance._component
    ) || {}

  $: panelDefinition =
    componentPropDefinition.properties &&
    componentPropDefinition.properties[selectedCategory.value]

  const onStyleChanged = store.actions.components.updateStyle

  $: isComponentOrScreen =
    $store.currentView === "component" ||
    $store.currentFrontEndType === FrontendTypes.SCREEN
  $: isNotScreenslot = componentInstance._component !== "##builtin/screenslot"

  $: displayName =
    isComponentOrScreen && componentInstance._instanceName && isNotScreenslot

  function walkProps(component, action) {
    action(component)
    if (component.children) {
      for (let child of component.children) {
        walkProps(child, action)
      }
    }
  }

  function flattenComponents(props) {
    const components = []
    props.forEach(comp =>
      walkProps(comp, c => {
        if ("_component" in c) {
          components.push(c)
        }
      })
    )
    return components
  }

  function setAssetProps(name, value) {
    const selectedAsset = get(currentAsset)
    store.update(state => {
      if (
        name === "_instanceName" &&
        state.currentFrontEndType === FrontendTypes.SCREEN
      ) {
        selectedAsset.props._instanceName = value
      } else {
        selectedAsset[name] = value
      }
      return state
    })
    store.actions.preview.saveSelected()
  }

  function getProps(obj, keys) {
    return keys.map((key, i) => [key, obj[key], obj.props._id + i])
  }
</script>

<CategoryTab
  onClick={category => (selectedCategory = category)}
  {categories}
  {selectedCategory} />

{#if displayName}
  <div class="instance-name">{componentInstance._instanceName}</div>
{/if}

<div class="component-props-container">
  {#if selectedCategory.value === 'design'}
    <DesignView {panelDefinition} {componentInstance} {onStyleChanged} />
  {:else if selectedCategory.value === 'settings'}
    <SettingsView
      {componentInstance}
      {componentDefinition}
      {panelDefinition}
      displayNameField={displayName}
      onChange={store.actions.components.updateProp}
      onScreenPropChange={setAssetProps}
      assetInstance={$store.currentView !== 'component' && $currentAsset} />
  {/if}
</div>

<style>
  .component-props-container {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
  }

  .instance-name {
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--grey-7);
  }
</style>
