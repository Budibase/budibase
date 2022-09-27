<script>
  import { Modal, ModalContent, Body, TooltipWrapper } from "@budibase/bbui"
  import { auth, admin, licensing } from "stores/portal"
  import { onMount } from "svelte"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let paymentFailedModal
  let pastDueEndDate

  const paymentFailedTitle = "Payment failed"
  $: accountUrl = $admin.accountPortalUrl
  $: billingUrl = `${accountUrl}/portal/billing`

  export function show() {
    paymentFailedModal.show()
  }

  export function hide() {
    paymentFailedModal.hide()
  }

  onMount(() => {
    licensing.subscribe(state => {
      pastDueEndDate = state.pastDueEndDate
    })
  })
</script>

<Modal bind:this={paymentFailedModal} on:show={onShow} on:hide={onDismiss}>
  {#if $auth.user.accountPortalAccess}
    <ModalContent
      title={paymentFailedTitle}
      size="M"
      confirmText="Billing"
      onConfirm={() => {
        window.location.href = billingUrl
      }}
    >
      <Body>The payment for your subscription has failed</Body>
      <Body>
        Please update your billing details before your account gets downgraded
        to the free plan
      </Body>
      <Body weight={800}>
        <div class="tooltip-root">
          {`${$licensing.pastDueDaysRemaining} day${
            $licensing.pastDueDaysRemaining == 1 ? "" : "s"
          } remaining`}
          <span class="tooltip">
            <TooltipWrapper tooltip={pastDueEndDate} size="S" />
          </span>
        </div>
      </Body>
    </ModalContent>
  {:else}
    <ModalContent title={paymentFailedTitle} size="M" showCancelButton={false}>
      <Body>The payment for your subscription has failed</Body>
      <Body>
        Please upgrade your billing details before your account gets downgraded
        to the free plan
      </Body>
      <Body>Please contact your account holder.</Body>
      <Body weight={800}>
        <div class="tooltip-root">
          {`${$licensing.pastDueDaysRemaining} day${
            $licensing.pastDueDaysRemaining == 1 ? "" : "s"
          } remaining`}
          <span class="tooltip">
            <TooltipWrapper tooltip={pastDueEndDate} size="S" />
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
