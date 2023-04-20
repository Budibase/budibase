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
  import { _ } from "../../../lang/i18n"

  let revertModal
  let appName

  $: appId = $store.appId

  const revert = async () => {
    try {
      await API.revertAppChanges(appId)

      // Reset frontend state after revert
      const applicationPkg = await API.fetchAppPackage(appId)
      await store.actions.initialise(applicationPkg)
      notifications.info($_("components.deploy.RevertModal.Changes_reverted"))
    } catch (error) {
      notifications.error(
        `${$_("components.deploy.RevertModal.Error_reverting")} ${error}`
      )
    }
  }
</script>

<ActionButton
  quiet
  icon="Revert"
  size="M"
  tooltip={$_("components.deploy.RevertModal.Revert_changes")}
  on:click={revertModal.show}
/>

<Modal bind:this={revertModal}>
  <ModalContent
    title={$_("components.deploy.RevertModal.Revert_changes")}
    confirmText={$_("components.deploy.RevertModal.Revert")}
    onConfirm={revert}
    disabled={appName !== $store.name}
  >
    <span>{$_("components.deploy.RevertModal.Changes_deleted")}</span>
    <span>{$_("components.deploy.RevertModal.enter_name")}</span>
    <Input bind:value={appName} />
  </ModalContent>
</Modal>
