<script>
  import { get } from "svelte/store"
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { Tabs, Tab } from "@budibase/bbui"
  import { FrontendTypes } from "constants"
  import SettingsSection from "./SettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ActionsSection from "./ActionsSection.svelte"
  import { setWith } from "lodash"

  let openSection = "settings"

  $: componentInstance = $selectedComponent
  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: isComponentOrScreen =
    $store.currentView === "component" ||
    $store.currentFrontEndType === FrontendTypes.SCREEN
  $: isNotScreenslot = !$selectedComponent._component.endsWith("screenslot")
  $: showDisplayName = isComponentOrScreen && isNotScreenslot

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

<Tabs selected="Settings" noPadding>
  <Tab title="Settings">
    <SettingsSection
      {componentInstance}
      {componentDefinition}
      {showDisplayName}
      onScreenPropChange={setAssetProps}
      assetInstance={$store.currentView !== "component" && $currentAsset}
      {openSection}
      on:open={() => (openSection = "settings")}
    />
    <DesignSection
      {componentInstance}
      {componentDefinition}
      {openSection}
      on:open={() => (openSection = "design")}
    />
    <CustomStylesSection
      {componentInstance}
      {componentDefinition}
      {openSection}
      on:open={() => (openSection = "custom")}
    />
    <ActionsSection
      {componentInstance}
      {componentDefinition}
      {openSection}
      on:open={() => (openSection = "actions")}
    />
  </Tab>
</Tabs>
