<script>
  import { get } from "svelte/store"
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { Tabs, Tab } from "@budibase/bbui"
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

<Tabs selected="Settings">
  <Tab title="Settings">
    <div class="tab-content-padding">
      {#if definition && definition.name}
        <div class="instance-name">{definition.name}</div>
      {/if}
      <SettingsView
        componentInstance={$selectedComponent}
        componentDefinition={definition}
        {showDisplayName}
        onChange={store.actions.components.updateProp}
        onScreenPropChange={setAssetProps}
        assetInstance={$store.currentView !== "component" && $currentAsset}
      />
    </div>
  </Tab>
  <Tab title="Design">
    <div class="tab-content-padding">
      {#if definition && definition.name}
        <div class="instance-name">{definition.name}</div>
      {/if}
      <DesignView
        componentInstance={$selectedComponent}
        componentDefinition={definition}
        {onStyleChanged}
        {onCustomStyleChanged}
        {onUpdateTransition}
        {onResetStyles}
      />
    </div>
  </Tab>
</Tabs>

<style>
  .tab-content-padding {
    padding: 0 var(--spacing-xl);
  }

  .instance-name {
    font-size: var(--spectrum-global-dimension-font-size-75);
    margin-bottom: var(--spacing-m);
    margin-top: var(--spacing-xs);
    font-weight: 600;
    color: var(--grey-7);
  }
</style>
