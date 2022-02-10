<script>
  import { Button, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { API } from "api"
  import analytics, { Events } from "analytics"
  import { store } from "builderStore"

  let feedbackModal
  let publishModal

  async function deployApp() {
    try {
      await API.deployAppChanges()
      analytics.captureEvent(Events.APP.PUBLISHED, {
        appId: $store.appId,
      })
      notifications.success("Application published successfully")
    } catch (error) {
      analytics.captureException(error)
      notifications.error("Error publishing app")
    }
  }
</script>

<Button secondary on:click={publishModal.show}>Publish</Button>
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
  >
    <span
      >The changes you have made will be published to the production version of
      the application.</span
    >
  </ModalContent>
</Modal>
