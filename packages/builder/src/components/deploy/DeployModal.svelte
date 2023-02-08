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
  import TourWrap from "../portal/onboarding/TourWrap.svelte"
  import { TOUR_STEP_KEYS } from "../portal/onboarding/tours.js"

  let publishModal
  let asyncModal
  let publishCompleteModal

  let published

  $: publishedUrl = published ? `${window.origin}/app${published.appUrl}` : ""

  export let onOk

  async function publishApp() {
    try {
      //In Progress
      asyncModal.show()
      publishModal.hide()

      published = await API.publishAppChanges($store.appId)

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

<TourWrap tourStepKey={TOUR_STEP_KEYS.BUILDER_APP_PUBLISH}>
  <Button cta on:click={publishModal.show} id={"builder-app-publish-button"}>
    Publish
  </Button>
</TourWrap>
<Modal bind:this={publishModal}>
  <ModalContent
    title="Publish to production"
    confirmText="Publish"
    onConfirm={publishApp}
  >
    The changes you have made will be published to the production version of the
    application.
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
  <ModalContent confirmText="Done" cancelText="View App" onCancel={viewApp}>
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
    <CopyInput value={publishedUrl} label="You can view your app at:" />
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
