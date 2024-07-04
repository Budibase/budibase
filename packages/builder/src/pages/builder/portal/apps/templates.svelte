<script>
import { Layout, Page } from "@budibase/bbui"
import { url } from "@roxi/routify"
import TemplateDisplay from "components/common/TemplateDisplay.svelte"
import { Breadcrumb, Breadcrumbs, Header } from "components/portal/page"
import { templates } from "stores/portal"
</script>

<Page>
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="Apps" />
      <Breadcrumb text="Templates" />
    </Breadcrumbs>
    <Header title="Templates" />
    <TemplateDisplay templates={$templates} />
  </Layout>
</Page>
