<script>
  import { Modal, ModalContent, Body, TooltipWrapper } from "@budibase/bbui"
  import { auth, admin, licensing } from "stores/portal"
  import { onMount } from "svelte"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let paymentFailedModal
  let pastDueAt

  const paymentFailedTitle = "Payment failed"
  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  export function show() {
    paymentFailedModal.show()
  }

  export function hide() {
    paymentFailedModal.hide()
  }

  onMount(() => {
    auth.subscribe(state => {
      if (state.user && state.user.license?.billing?.subscription) {
        pastDueAt = new Date(
          state.user.license?.billing?.subscription.pastDueAt * 1000
        )
      }
    })
  })
</script>

<Modal bind:this={paymentFailedModal} on:show={onShow} on:hide={onDismiss}>
  {#if $auth.user.accountPortalAccess}
    <ModalContent
      title={paymentFailedTitle}
      size="M"
      confirmText="Upgrade"
      onConfirm={() => {
        window.location.href = upgradeUrl
      }}
    >
      <Body>The payment for your business plan subscription has failed</Body>
      <Body>
        Please upgrade your billing details before your account gets downgraded
        to the free plan
      </Body>
      <Body weight={800}>
        <div class="tooltip-root">
          {`${$licensing.paymentDueDaysRemaining} day${
            $licensing.paymentDueDaysRemaining == 1 ? "" : "s"
          } remaining`}
          <span class="tooltip">
            <TooltipWrapper tooltip={pastDueAt.toString()} size="S" />
          </span>
        </div>
      </Body>
    </ModalContent>
  {:else}
    <ModalContent title={paymentFailedTitle} size="M" showCancelButton={false}>
      <Body>The payment for your business plan subscription has failed</Body>
      <Body>
        Please upgrade your billing details before your account gets downgraded
        to the free plan
      </Body>
      <Body>Please contact your account holder.</Body>
      <Body weight={800}>
        <div class="tooltip-root">
          {`${$licensing.paymentDueDaysRemaining} day${
            $licensing.paymentDueDaysRemaining == 1 ? "" : "s"
          } remaining`}
          <span class="tooltip">
            <TooltipWrapper tooltip={pastDueAt.toString()} size="S" />
          </span>
        </div>
      </Body>
    </ModalContent>
  {/if}
</Modal>

<style>
  .tooltip-root {
    display: flex;
    align-items: center;
  }
</style>
