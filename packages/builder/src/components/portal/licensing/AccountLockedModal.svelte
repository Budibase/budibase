<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { LockReason } from "@budibase/types"

  let modal

  export let lockedBy
  export let onConfirm

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Your tenant is currently de-activated"
    size="S"
    showCancelButton={false}
    showCloseIcon={true}
    confirmText={"View plans"}
    {onConfirm}
  >
    <Body size="S">
      {#if lockedBy === LockReason.MIGRATION}
        You’re currently on the Budibase Free plan, which is no longer available
        for cloud users. Your tenant has been temporarily locked. Upgrade to keep
        building in the cloud, export your workspaces, or move to self-hosted
        Budibase before your data is removed.
      {:else if lockedBy === LockReason.PAID_TO_FREE}
        Your paid Budibase subscription has expired and was not renewed. Your
        tenant is now in a locked, limited-access state. Upgrade to keep building
        in the cloud, export your workspaces, or move to self-hosted Budibase
        before your data is removed.
      {:else if lockedBy === LockReason.FREE_TIER}
        Your Budibase Cloud trial has ended and your tenant is temporarily locked.
        Upgrade to keep building in the cloud, export your workspaces, or move to
        self-hosted Budibase before your data is removed.
      {:else}
        Due to the Free plan user limit being exceeded, your tenant has been
        de-activated. Upgrade your plan to re-activate your tenant.
      {/if}
    </Body>
  </ModalContent>
</Modal>
