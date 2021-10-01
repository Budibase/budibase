<script>
  import { Button, Modal, notifications, ModalContent } from "@budibase/bbui"
  import api from "builderStore/api"
  import analytics, { Events } from "analytics"
  import { store } from "builderStore"

  let feedbackModal
  let publishModal

  async function deployApp() {
    try {
      const response = await api.post("/api/deploy")
      if (response.status !== 200) {
        throw new Error(`status ${response.status}`)
      } else {
        analytics.captureEvent(Events.APP.PUBLISHED, {
          appId: $store.appId,
        })
        notifications.success(`Application published successfully`)
      }
    } catch (err) {
      analytics.captureException(err)
      notifications.error(`Error publishing app: ${err}`)
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
