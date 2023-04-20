<script>
  import { _ } from "../../../../../../../../../../lang/i18n"
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
    notifications.success(
      $_(
        "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutSettingsPanel.Components_copied"
      )
    )
  }
</script>

<Panel title={$selectedLayout?.name} icon="Experience" borderLeft>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Banner type="warning" showCloseButton={false}>
      {$_(
        "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutSettingsPanel.layouts_deprecated"
      )}
    </Banner>
    <Body size="S">
      {$_(
        "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutSettingsPanel.save_content"
      )}
    </Body>
    <Body size="S">
      {$_(
        "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutSettingsPanel.copy_components"
      )}
    </Body>
    <Button cta on:click={copyLayout}
      >{$_(
        "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutSettingsPanel.Copy_components"
      )}</Button
    >
  </Layout>
</Panel>
