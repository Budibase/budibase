<script>
  import { Input, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { appStore, initialise } from "@/stores/builder"
  import { API } from "@/api"

  export let onComplete = () => {}

  let revertModal
  let appName

  $: appId = $appStore.appId

  const revert = async () => {
    try {
      await API.revertAppChanges(appId)

      // Reset frontend state after revert
      const applicationPkg = await API.fetchAppPackage(appId)
      await initialise(applicationPkg)
      notifications.info("Changes reverted successfully")
      onComplete()
    } catch (error) {
      notifications.error(`Error reverting changes: ${error}`)
    }
  }

  export const hide = () => {
    revertModal.hide()
  }

  export const show = () => {
    revertModal.show()
  }
</script>

<Modal bind:this={revertModal}>
  <ModalContent
    title="Revert Changes"
    confirmText="Revert"
    onConfirm={revert}
    disabled={appName !== $appStore.name}
  >
    <span
      >The changes you have made will be deleted and the application reverted
      back to its production state.</span
    >
    <span>Please enter your app name to continue.</span>
    <Input bind:value={appName} />
  </ModalContent>
</Modal>
