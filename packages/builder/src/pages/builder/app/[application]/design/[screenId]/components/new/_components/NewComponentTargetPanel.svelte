<script>
  import Panel from "components/design/Panel.svelte"
  import { Body, Layout } from "@budibase/bbui"
  import { selectedComponent, selectedScreen, store } from "builderStore"

  $: componentDefinition = store.actions.components.getDefinition(
    $selectedComponent?._component
  )
  $: isScreen = $selectedComponent?._id === $selectedScreen?.props._id
  $: title = isScreen ? "Screen" : $selectedComponent?._instanceName
  $: position = componentDefinition?.hasChildren ? "inside" : "below"
</script>

<Panel {title} icon={componentDefinition?.icon} borderLeft>
  <Layout paddingX="L" paddingY="XL">
    <Body size="S">
      Components that you add will be placed {position}
      {title}
    </Body>
  </Layout>
</Panel>
