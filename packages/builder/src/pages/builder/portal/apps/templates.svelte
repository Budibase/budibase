<script>
  import { url } from "@roxi/routify"
  import { Layout, Page } from "@budibase/bbui"
  import TemplateDisplay from "@/components/common/TemplateDisplay.svelte"
  import { templates } from "@/stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "@/components/portal/page"
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
