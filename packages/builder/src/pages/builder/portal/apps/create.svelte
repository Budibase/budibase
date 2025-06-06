<script lang="ts">
  import { url } from "@roxi/routify"
  import FirstAppOnboarding from "./onboarding/index.svelte"
  import { Layout, Page, Button, Modal } from "@budibase/bbui"
  import CreateAppModal from "@/components/start/CreateAppModal.svelte"
  import TemplateDisplay from "@/components/common/TemplateDisplay.svelte"
  import AppLimitModal from "@/components/portal/licensing/AppLimitModal.svelte"
  import {
    appsStore,
    templates,
    licensing,
    featureFlags,
  } from "@/stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "@/components/portal/page"
  import type { AppTemplate } from "@/types"

  let template: AppTemplate | null
  let creationModal: Modal
  let appLimitModal: AppLimitModal

  $: licensedApps = $licensing?.usageMetrics?.apps || 0

  const initiateAppCreation = () => {
    if (licensedApps >= 100) {
      appLimitModal.show()
    } else {
      template = null
      creationModal.show()
    }
  }

  const stopAppCreation = () => {
    template = null
  }

  const initiateAppImport = () => {
    if (licensedApps >= 100) {
      appLimitModal.show()
    } else {
      template = { fromFile: true }
      creationModal.show()
    }
  }

  $: appsOrWorkspaces = $featureFlags.WORKSPACE_APPS ? "Workspaces" : "Apps"

  $: createNewText = $featureFlags.WORKSPACE_APPS
    ? "Create new workspace"
    : "Create new app"
  $: importText = $featureFlags.WORKSPACE_APPS
    ? "Import workspace"
    : "Import app"
</script>

{#if !$appsStore.apps.length}
  <FirstAppOnboarding />
{:else}
  <Page>
    <Layout noPadding gap="L">
      <Breadcrumbs>
        <Breadcrumb url={$url("./")} text={appsOrWorkspaces} />
        <Breadcrumb text={createNewText} />
      </Breadcrumbs>
      <Header title={createNewText}>
        <div slot="buttons">
          <Button size="M" secondary on:click={initiateAppImport}>
            {importText}
          </Button>
          <Button size="M" cta on:click={initiateAppCreation}>
            Start from scratch
          </Button>
        </div>
      </Header>
      <TemplateDisplay templates={$templates} />
    </Layout>
  </Page>
  <Modal bind:this={creationModal} on:hide={stopAppCreation}>
    <CreateAppModal {template} />
  </Modal>
  <AppLimitModal bind:this={appLimitModal} />
{/if}
