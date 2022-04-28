<script>
  import SettingsPanel from "components/design/settings/SettingsPanel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import { selectedComponent, selectedScreen, store } from "builderStore"

  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: isScreen = $selectedComponent?._id === $selectedScreen?.props._id
  $: title = isScreen ? "Screen" : $selectedComponent?._instanceName
  $: position = componentDefinition?.hasChildren ? "inside" : "below"
</script>

<SettingsPanel {title} icon={componentDefinition?.icon}>
  <Layout paddingX="L" paddingY="XL">
    <Body size="S">
      Components that you add will be placed {position}
      {title}
    </Body>
  </Layout>
</SettingsPanel>
