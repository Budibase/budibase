<script>
  import { store, selectedComponent, currentAsset } from "builderStore"
  import { Tabs, Tab } from "@budibase/bbui"
  import ScreenSettingsSection from "./ScreenSettingsSection.svelte"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import DesignSection from "./DesignSection.svelte"
  import CustomStylesSection from "./CustomStylesSection.svelte"
  import ActionsSection from "./ActionsSection.svelte"

  let openSection = "settings"

  $: componentInstance = $selectedComponent
  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
</script>

<Tabs selected="Settings" noPadding>
  <Tab title="Settings">
    <ScreenSettingsSection
      {componentInstance}
      {componentDefinition}
      {openSection}
      on:open={() => (openSection = "settings")}
    />
    <ComponentSettingsSection
      {componentInstance}
      {componentDefinition}
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
