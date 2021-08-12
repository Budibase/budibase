<script>
  import { Modal, ModalContent, Button } from "@budibase/bbui"

  let upgradeModal
</script>

<div>
  <Button
    on:click={upgradeModal.show}
    quiet
    primary
    size="M"
    icon="DownloadFromCloud">Upgrade to self-hosted</Button
  >
</div>
<Modal bind:this={upgradeModal}>
  <ModalContent size="M" title="Upgrade to self-hosted" confirmText="Upgrade">
    <span
      >Upgrade to Budibase self-hosting for free, and get SSO, unlimited apps,
      and more - and it only takes 10 minutes!</span
    >
  </ModalContent>
</Modal>
