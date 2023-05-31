<script>
  import {
    Input,
    Modal,
    notifications,
    ModalContent,
    ActionButton,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import { API } from "api"

  export let disabled = false

  let revertModal
  let appName

  $: appId = $store.appId

  const revert = async () => {
    try {
      await API.revertAppChanges(appId)

      // Reset frontend state after revert
      const applicationPkg = await API.fetchAppPackage(appId)
      await store.actions.initialise(applicationPkg)
      notifications.info("Changes reverted successfully")
    } catch (error) {
      notifications.error(`Error reverting changes: ${error}`)
    }
  }
</script>

<ActionButton
  quiet
  icon="Revert"
  size="M"
  tooltip="Revert changes"
  on:click={revertModal.show}
  {disabled}
/>

<Modal bind:this={revertModal}>
  <ModalContent
    title="Revert Changes"
    confirmText="Revert"
    onConfirm={revert}
    disabled={appName !== $store.name}
  >
    <span
      >The changes you have made will be deleted and the application reverted
      back to its production state.</span
    >
    <span>Please enter your app name to continue.</span>
    <Input bind:value={appName} />
  </ModalContent>
</Modal>
