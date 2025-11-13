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

<Modal bind:this={modal} on:hide={modal}>
  <ModalContent
    title="Your account is currently de-activated"
    size="S"
    showCancelButton={true}
    showCloseIcon={false}
    confirmText={"View plans"}
    {onConfirm}
  >
    <Body size="S">
      {#if lockedBy === LockReason.FREE_TIER}
        You’re currently on the Budibase Free plan, which is no longer available
        for cloud users. Your tenant has been temporarily locked. Please upgrade
        to a paid plan to keep your data — otherwise it will be removed soon.
      {:else}
        Due to the Free plan user limit being exceeded, your account has been
        de-activated. Upgrade your plan to re-activate your account.
      {/if}
    </Body>
  </ModalContent>
</Modal>
