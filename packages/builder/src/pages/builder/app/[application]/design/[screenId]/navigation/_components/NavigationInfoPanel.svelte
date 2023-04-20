<script>
  import { _ } from "../../../../../../../../../lang/i18n"
  import Panel from "components/design/Panel.svelte"
  import { Body, Layout, Banner } from "@budibase/bbui"
  import { selectedScreen, store } from "builderStore"
  import { get } from "svelte/store"

  const removeCustomLayout = async () => {
    return store.actions.screens.removeCustomLayout(get(selectedScreen))
  }
</script>

<Panel
  borderLeft
  title={$_(
    "pages.builder.app.application.design.screenId.navigation._components.NavigationinfoPanel.Navigation"
  )}
  icon="InfoOutline"
>
  <Layout paddingX="L" paddingY="XL" gap="S">
    {#if $selectedScreen.layoutId}
      <Banner
        type="warning"
        extraButtonText={$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationinfoPanel.Detach_layout"
        )}
        extraButtonAction={removeCustomLayout}
        showCloseButton={false}
      >
        {$_(
          "pages.builder.app.application.design.screenId.navigation._components.NavigationinfoPanel.t_preview"
        )}
      </Banner>
    {/if}
    <Body size="S">
      {$_(
        "pages.builder.app.application.design.screenId.navigation._components.NavigationinfoPanel.navigation_configured"
      )}
    </Body>
    <Body size="S">
      {$_(
        "pages.builder.app.application.design.screenId.navigation._components.NavigationinfoPanel.navigation_screen"
      )}
    </Body>
  </Layout>
</Panel>
