<script>
  import { Modal, ModalContent, Button } from "@budibase/bbui"
  import { admin } from "stores/portal"

  let upgradeModal

  const onConfirm = () => {
    window.open(`${$admin.accountPortalUrl}/portal/install`, "_blank")
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
    title="Self-host Budibase"
    confirmText="Self-host Budibase"
  >
    <span>
      Self-host budibase for free to get unlimited apps and more - and it only
      takes a few minutes!
    </span>
  </ModalContent>
</Modal>
