<script>
  import { get } from "svelte/store"
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { FrontendTypes } from "constants"
  import CategoryTab from "./CategoryTab.svelte"
  import DesignView from "./DesignView.svelte"
  import SettingsView from "./SettingsView.svelte"
  import { setWith } from "lodash"

  const categories = [
    { value: "settings", name: "Settings" },
    { value: "design", name: "Design" },
  ]
  let selectedCategory = categories[0]

  $: definition = store.actions.components.getDefinition(
    $selectedComponent._component
  )
  $: isComponentOrScreen =
    $store.currentView === "component" ||
    $store.currentFrontEndType === FrontendTypes.SCREEN
  $: isNotScreenslot = !$selectedComponent._component.endsWith("screenslot")
  $: showDisplayName = isComponentOrScreen && isNotScreenslot

  const onStyleChanged = store.actions.components.updateStyle
  const onCustomStyleChanged = store.actions.components.updateCustomStyle
  const onUpdateTransition = store.actions.components.updateTransition
  const onResetStyles = store.actions.components.resetStyles

  function setAssetProps(name, value) {
    const selectedAsset = get(currentAsset)
    store.update(state => {
      if (
        name === "_instanceName" &&
        state.currentFrontEndType === FrontendTypes.SCREEN
      ) {
        selectedAsset.props._instanceName = value
      } else {
        setWith(selectedAsset, name.split("."), value, Object)
      }
      return state
    })
    store.actions.preview.saveSelected()
  }
</script>

<CategoryTab
  onClick={category => (selectedCategory = category)}
  {categories}
  {selectedCategory} />

{#if showDisplayName}
  <div class="instance-name">{$selectedComponent._instanceName}</div>
{/if}

<div class="component-props-container">
  {#if selectedCategory.value === 'design'}
    <DesignView
      componentInstance={$selectedComponent}
      componentDefinition={definition}
      {onStyleChanged}
      {onCustomStyleChanged}
      {onUpdateTransition}
      {onResetStyles} />
  {:else if selectedCategory.value === 'settings'}
    <SettingsView
      componentInstance={$selectedComponent}
      componentDefinition={definition}
      {showDisplayName}
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
