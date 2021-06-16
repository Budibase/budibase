<script>
  import { Icon, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"

  let revertModal

  $: appId = $store.appId

  const revert = async () => {
    try {
      const response = await api.post(`/api/dev/${appId}/revert`)
      const json = await response.json()
      if (response.status !== 200) throw json.message

      // Reset frontend state after revert
      const applicationPkg = await api.get(
        `/api/applications/${appId}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        await store.actions.initialise(pkg)
      } else {
        throw new Error(pkg)
      }

      notifications.info("Changes reverted.")
    } catch (err) {
      notifications.error(`Error reverting changes: ${err}`)
    }
  }
</script>

<Icon name="Revert" hoverable on:click={revertModal.show} />
<Modal bind:this={revertModal}>
  <ModalContent title="Revert Changes" confirmText="Revert" onConfirm={revert}>
    <span
      >The changes you have made will be deleted and the application reverted
      back to its production state.</span
    >
  </ModalContent>
</Modal>
