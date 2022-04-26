<script>
  import SettingsPanel from "components/design/settings/SettingsPanel.svelte"
  import { store, selectedComponent, currentAsset } from "builderStore"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ConditionalUISection from "./ConditionalUISection.svelte"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"

  $: componentInstance = $selectedComponent
  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
  $: componentBindings = getComponentBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
</script>

{#if $selectedComponent}
  <SettingsPanel
    title={$selectedComponent._instanceName}
    icon={componentDefinition.icon}
  >
    <ComponentSettingsSection
      {componentInstance}
      {componentDefinition}
      {bindings}
      {componentBindings}
    />
    <DesignSection {componentInstance} {componentDefinition} {bindings} />
    <CustomStylesSection {componentInstance} {componentDefinition} {bindings} />
    <ConditionalUISection
      {componentInstance}
      {componentDefinition}
      {bindings}
    />
  </SettingsPanel>
{/if}
