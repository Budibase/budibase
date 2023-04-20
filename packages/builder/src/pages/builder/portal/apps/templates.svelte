<script>
  import { url } from "@roxi/routify"
  import { Layout, Page } from "@budibase/bbui"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import { templates } from "stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "components/portal/page"

  import { _ } from "../../../../../lang/i18n"
</script>

<Page>
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb
        url={$url("./")}
        text={$_("pages.builder.portal.apps.templates.Apps")}
      />
      <Breadcrumb text={$_("pages.builder.portal.apps.templates.Templates")} />
    </Breadcrumbs>
    <Header title={$_("pages.builder.portal.apps.templates.Templates")} />
    <TemplateDisplay templates={$templates} />
  </Layout>
</Page>
