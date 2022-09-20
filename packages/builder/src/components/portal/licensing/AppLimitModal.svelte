<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"

  export let onDismiss = () => {}

  let appLimitModal

  $: accountUrl = $admin.accountPortalUrl
  $: upgradeUrl = `${accountUrl}/portal/upgrade`

  export function show() {
    appLimitModal.show()
  }

  export function hide() {
    appLimitModal.hide()
  }
</script>

<Modal bind:this={appLimitModal} on:hide={onDismiss}>
  <ModalContent
    title="Upgrade to get more apps "
    size="M"
    showCancelButton={false}
    confirmText={$auth.user.accountPortalAccess ? "Upgrade" : "Confirm"}
    onConfirm={$auth.user.accountPortalAccess
      ? () => {
          window.location.href = upgradeUrl
        }
      : null}
  >
    <Body>
      You are currently on our <span class="free-plan">Free plan</span>. Upgrade
      to our Pro plan to get unlimited apps and additional features.
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
