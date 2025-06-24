<script lang="ts">
  import { url } from "@roxi/routify"
  import { Layout, Page } from "@budibase/bbui"
  import TemplateDisplay from "@/components/common/TemplateDisplay.svelte"
  import { featureFlags, templates } from "@/stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "@/components/portal/page"

  $: appsOrWorkspaces = $featureFlags.WORKSPACE_APPS ? "Workspaces" : "Apps"
</script>

<Page>
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text={appsOrWorkspaces} />
      <Breadcrumb text="Templates" />
    </Breadcrumbs>
    <Header title="Templates" />
    <TemplateDisplay templates={$templates} />
  </Layout>
</Page>
