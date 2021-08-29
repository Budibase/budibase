<script>
  import { Icon, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import { _ as t } from "svelte-i18n"

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

      notifications.info($t("changes-reverted"))
    } catch (err) {
      notifications.error($t("error-reverting-changes") + `: ${err}`)
    }
  }
</script>

<Icon name="Revert" hoverable on:click={revertModal.show} />
<Modal bind:this={revertModal}>
  <ModalContent
    title={$t("revert-changes")}
    confirmText="Revert"
    onConfirm={revert}
  >
    <span
      >{$t(
        "the-changes-you-have-made-will-be-deleted-and-the-application-reverted-back-to-its-production-state"
      )}</span
    >
  </ModalContent>
</Modal>
