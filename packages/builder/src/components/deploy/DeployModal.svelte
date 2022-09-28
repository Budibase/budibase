<script>
  import {
    Button,
    Modal,
    notifications,
    ModalContent,
    Layout,
  } from "@budibase/bbui"
  import { API } from "api"
  import analytics, { Events, EventSource } from "analytics"
  import { store } from "builderStore"
  import { ProgressCircle } from "@budibase/bbui"
  import CopyInput from "components/common/inputs/CopyInput.svelte"

  let feedbackModal
  let publishModal
  let asyncModal
  let publishCompleteModal

  let published

  $: publishedUrl = published ? `${window.origin}/app${published.appUrl}` : ""

  export let onOk

  async function deployApp() {
    try {
      //In Progress
      asyncModal.show()
      publishModal.hide()

      published = await API.deployAppChanges()

      if (typeof onOk === "function") {
        await onOk()
      }

      //Request completed
      asyncModal.hide()
      publishCompleteModal.show()
    } catch (error) {
      analytics.captureException(error)
      notifications.error("Error publishing app")
    }
  }

  const viewApp = () => {
    if (published) {
      analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
        appId: $store.appId,
        eventSource: EventSource.PORTAL,
      })
      window.open(publishedUrl, "_blank")
    }
  }
</script>

<Button cta on:click={publishModal.show}>Publish</Button>
<Modal bind:this={feedbackModal}>
  <ModalContent
    title="Enjoying Budibase?"
    size="L"
    showConfirmButton={false}
    showCancelButton={false}
  />
</Modal>

<Modal bind:this={publishModal}>
  <ModalContent
    title="Publish to Production"
    confirmText="Publish"
    onConfirm={deployApp}
    dataCy={"deploy-app-modal"}
  >
    <span
      >The changes you have made will be published to the production version of
      the application.</span
    >
  </ModalContent>
</Modal>

<!-- Publish in progress -->
<Modal bind:this={asyncModal}>
  <ModalContent
    showCancelButton={false}
    showConfirmButton={false}
    showCloseIcon={false}
  >
    <Layout justifyItems="center">
      <ProgressCircle size="XL" />
    </Layout>
  </ModalContent>
</Modal>

<!-- Publish complete -->
<Modal bind:this={publishCompleteModal}>
  <ModalContent
    confirmText="Done"
    cancelText="View App"
    onCancel={viewApp}
    dataCy="deploy-app-success-modal"
  >
    <div slot="header" class="app-published-header">
      <svg
        width="26px"
        height="26px"
        class="spectrum-Icon success-icon"
        focusable="false"
      >
        <use xlink:href="#spectrum-icon-18-GlobeCheck" />
      </svg>
      <span class="app-published-header-text">App Published!</span>
    </div>
    <CopyInput
      value={publishedUrl}
      label="You can view your app at:"
      dataCy="deployed-app-url"
    />
  </ModalContent>
</Modal>

<style>
  .app-published-header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .success-icon {
    color: var(--spectrum-global-color-green-600);
  }
  .app-published-header .app-published-header-text {
    padding-left: var(--spacing-l);
  }
</style>
