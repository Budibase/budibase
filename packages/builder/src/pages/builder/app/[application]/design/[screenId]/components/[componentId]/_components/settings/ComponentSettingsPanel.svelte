<script>
  import Panel from "components/design/Panel.svelte"
  import { store, selectedComponent, selectedScreen } from "builderStore"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ConditionalUISection from "./ConditionalUISection.svelte"
  import ComponentInfoSection from "./ComponentInfoSection.svelte"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"

  $: componentInstance = $selectedComponent
  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: bindings = getBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: isScreen = $selectedComponent?._id === $selectedScreen?.props._id
  $: title = isScreen ? "Screen" : $selectedComponent?._instanceName
</script>

{#if $selectedComponent}
  {#key $selectedComponent._id}
    <Panel {title} icon={componentDefinition?.icon} borderLeft>
      {#if componentDefinition.info}
        <ComponentInfoSection {componentDefinition} />
      {/if}
      <ComponentSettingsSection
        {componentInstance}
        {componentDefinition}
        {bindings}
        {componentBindings}
        {isScreen}
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
    </Panel>
  {/key}
{/if}
