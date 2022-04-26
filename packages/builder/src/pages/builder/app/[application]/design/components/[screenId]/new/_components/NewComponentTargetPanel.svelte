<script>
  import SettingsPanel from "components/design/settings/SettingsPanel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import { selectedComponent, selectedScreen, store } from "builderStore"

  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: isScreen = $selectedComponent?._id === $selectedScreen?.props._id
  $: title = isScreen ? "Screen" : $selectedComponent?._instanceName
</script>

<SettingsPanel {title} icon={componentDefinition?.icon}>
  <Layout paddingX="L" paddingY="XL">
    <Body>The component you add will be placed inside {title}</Body>
  </Layout>
</SettingsPanel>
