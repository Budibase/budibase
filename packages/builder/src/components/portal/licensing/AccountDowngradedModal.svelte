<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { auth, admin } from "@/stores/portal"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let accountDowngradeModal

  $: accountUrl = $admin.accountPortalUrl
  $: billingUrl = `${accountUrl}/portal/billing`

  export function show() {
    accountDowngradeModal.show()
  }

  export function hide() {
    accountDowngradeModal.hide()
  }
</script>

<Modal bind:this={accountDowngradeModal} on:show={onShow} on:hide={onDismiss}>
  <ModalContent
    title="Your account is now on the Free plan"
    size="M"
    showCancelButton={$auth.user.accountPortalAccess}
    confirmText={$auth.user.accountPortalAccess ? "Billing" : "Confirm"}
    onConfirm={$auth.user.accountPortalAccess
      ? () => {
          window.location.href = billingUrl
        }
      : null}
  >
    <Body>
      The payment for your subscription has failed and we have downgraded your
      account to the <span class="free-plan">Free plan</span>.
    </Body>
    <Body>
      Please update your billing details to restore full functionality.
    </Body>
    {#if !$auth.user.accountPortalAccess}
      <Body>Please contact the account holder to upgrade.</Body>
    {/if}
  </ModalContent>
</Modal>

<style>
  .free-plan {
    font-weight: 600;
  }
</style>
