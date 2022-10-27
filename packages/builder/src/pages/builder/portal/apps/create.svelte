<script>
  import { url } from "@roxi/routify"
  import { Layout, Page, Button, Modal } from "@budibase/bbui"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
  import { apps, templates, licensing } from "stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "components/portal/page"

  let template
  let creationModal = false
  let appLimitModal
  let creatingApp = false

  const initiateAppCreation = () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      template = null
      creationModal.show()
      creatingApp = true
    }
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const initiateAppImport = () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      template = { fromFile: true }
      creationModal.show()
      creatingApp = true
    }
  }
</script>

<Page>
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="Apps" />
      <Breadcrumb text="Create new app" />
    </Breadcrumbs>
    <Header title={$apps.length ? "Create new app" : "Create your first app"}>
      <div slot="buttons">
        <Button
          dataCy="import-app-btn"
          size="M"
          newStyles
          secondary
          on:click={initiateAppImport}
        >
          Import app
        </Button>
        <Button
          dataCy="create-app-btn"
          size="M"
          cta
          on:click={initiateAppCreation}
        >
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

<style>
  .title .welcome > .buttons {
    padding-top: 30px;
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .buttons {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }
</style>
