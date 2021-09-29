<script>
  import { Modal, ModalContent, Button } from "@budibase/bbui"

  let upgradeModal

  const onConfirm = () => {
    window.open("https://account.budibase.app/install", "_blank")
  }
</script>

<div>
  <Button
    on:click={upgradeModal.show}
    quiet
    primary
    size="M"
    icon="DownloadFromCloud">Self-host Budibase</Button
  >
</div>
<Modal bind:this={upgradeModal}>
  <ModalContent
    size="M"
    {onConfirm}
    title="Upgrade to self-hosted"
    confirmText="Upgrade"
  >
    <span
      >Upgrade to Budibase self-hosting for free, and get SSO, unlimited apps,
      and more - and it only takes a few minutes!</span
    >
  </ModalContent>
</Modal>
