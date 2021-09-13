<script>
  import { Modal, ModalContent, Button } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  let upgradeModal

  const onConfirm = () => {
    window.open("https://accounts.budibase.com/install", "_blank")
  }
</script>

<div>
  <Button
    on:click={upgradeModal.show}
    quiet
    primary
    size="M"
    icon="DownloadFromCloud">{$t("self-host")}</Button
  >
</div>
<Modal bind:this={upgradeModal}>
  <ModalContent
    cancelText={$t("cancel")}
    size="M"
    {onConfirm}
    title={$t("upgrade-to-self-hosted")}
    confirmText={$t("upgrade")}
  >
    <span
      >{$t(
        "upgrade-to-self-hosting-for-free-and-get-sso-unlimited-apps-and-more-and-it-only-takes-a-few-minutes"
      )}</span
    >
  </ModalContent>
</Modal>
