<script>
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { Tabs, Tab } from "@budibase/bbui"
  import ScreenSettingsSection from "./ScreenSettingsSection.svelte"
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

<Tabs selected="Settings" noPadding>
  <Tab title="Settings">
    <div class="container">
      {#key componentInstance?._id}
        <ScreenSettingsSection
          {componentInstance}
          {componentDefinition}
          {bindings}
        />
        <ComponentSettingsSection
          {componentInstance}
          {componentDefinition}
          {bindings}
          {componentBindings}
        />
        <DesignSection {componentInstance} {componentDefinition} {bindings} />
        <CustomStylesSection
          {componentInstance}
          {componentDefinition}
          {bindings}
        />
        <ConditionalUISection
          {componentInstance}
          {componentDefinition}
          {bindings}
        />
      {/key}
    </div>
  </Tab>
</Tabs>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
