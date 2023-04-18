<script>
  import Panel from "components/design/Panel.svelte"
  import { Body, Layout } from "@budibase/bbui"

  import { _ } from "lang/i18n"
</script>

<Panel
  borderLeft
  title={$_(
    "pages.builder.app.application.design.screenId.theme._components.ThemeinfoPanel.Theme"
  )}
  icon="InfoOutline"
>
  <Layout paddingX="L" paddingY="XL">
    <Body size="S">
      {$_(
        "pages.builder.app.application.design.screenId.theme._components.ThemeinfoPanel.theme_set"
      )}
    </Body>
  </Layout>
</Panel>
