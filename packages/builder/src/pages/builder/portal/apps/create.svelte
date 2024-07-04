<script>
import { Button, Layout, Modal, Page } from "@budibase/bbui"
import { url } from "@roxi/routify"
import TemplateDisplay from "components/common/TemplateDisplay.svelte"
import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
import { Breadcrumb, Breadcrumbs, Header } from "components/portal/page"
import CreateAppModal from "components/start/CreateAppModal.svelte"
import { appsStore, licensing, templates } from "stores/portal"
import FirstAppOnboarding from "./onboarding/index.svelte"

let template
let creationModal = false
let appLimitModal

const initiateAppCreation = () => {
  if ($licensing?.usageMetrics?.apps >= 100) {
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
  if ($licensing?.usageMetrics?.apps >= 100) {
    appLimitModal.show()
  } else {
    template = { fromFile: true }
    creationModal.show()
  }
}
</script>

{#if !$appsStore.apps.length}
  <FirstAppOnboarding />
{:else}
  <Page>
    <Layout noPadding gap="L">
      <Breadcrumbs>
        <Breadcrumb url={$url("./")} text="Apps" />
        <Breadcrumb text="Create new app" />
      </Breadcrumbs>
      <Header title={"Create new app"}>
        <div slot="buttons">
          <Button size="M" secondary on:click={initiateAppImport}>
            Import app
          </Button>
          <Button size="M" cta on:click={initiateAppCreation}>
            Start from scratch
          </Button>
        </div>
      </Header>
      <TemplateDisplay templates={$templates} />
    </Layout>
  </Page>
  <Modal
    bind:this={creationModal}
    padding={false}
    width="600px"
    on:hide={stopAppCreation}
  >
    <CreateAppModal {template} />
  </Modal>
  <AppLimitModal bind:this={appLimitModal} />
{/if}
