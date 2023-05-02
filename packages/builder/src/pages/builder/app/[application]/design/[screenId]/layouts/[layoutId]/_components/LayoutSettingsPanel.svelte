<script>
  import Panel from "components/design/Panel.svelte"
  import { store, selectedLayout } from "builderStore"
  import { Layout, Body, Button, Banner, notifications } from "@budibase/bbui"
  import { Component } from "builderStore/store/screenTemplates/utils/Component"

  const copyLayout = () => {
    // Build an outer container component to put layout contents inside
    let container = new Component("@budibase/standard-components/container")
      .instanceName($selectedLayout.name)
      .customProps({
        gap: "M",
        direction: "column",
        hAlign: "stretch",
        vAlign: "top",
        size: "shrink",
      })
      .json()

    // Attach layout components
    container._children = $selectedLayout.props._children

    // Replace the screenslot component with a container. This is better than
    // simply removing it as it still shows its position.
    container = JSON.parse(
      JSON.stringify(container).replace(
        "@budibase/standard-components/screenslot",
        "@budibase/standard-components/container"
      )
    )

    // Copy new component structure
    store.actions.components.copy(container)
    notifications.success("Components copied successfully")
  }
</script>

<Panel title={$selectedLayout?.name} icon="Experience" borderLeft wide>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Banner type="warning" showCloseButton={false}>
      Custom layouts are being deprecated. They will be removed in a future
      release.
    </Banner>
    <Body size="S">
      You can save the content of this layout by pressing the button below.
    </Body>
    <Body size="S">
      This will copy all components inside your layout, which you can then paste
      into a screen.
    </Body>
    <Button cta on:click={copyLayout}>Copy components</Button>
  </Layout>
</Panel>
