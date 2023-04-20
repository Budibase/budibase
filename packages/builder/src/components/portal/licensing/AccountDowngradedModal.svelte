<script>
  import { _ } from "../../../../lang/i18n"
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"

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
    title={$_("components.portal.licensing.AccountDowngradedModal.Your")}
    size="M"
    showCancelButton={$auth.user.accountPortalAccess}
    confirmText={$auth.user.accountPortalAccess
      ? $_("components.portal.licensing.AccountDowngradedModal.Billing")
      : $_("components.portal.licensing.AccountDowngradedModal.Confirm")}
    onConfirm={$auth.user.accountPortalAccess
      ? () => {
          window.location.href = billingUrl
        }
      : null}
  >
    <Body>
      {$_("components.portal.licensing.AccountDowngradedModal.The")}
      <span class="free-plan"
        >{$_("components.portal.licensing.AccountDowngradedModal.Free")}</span
      >.
    </Body>
    <Body>
      {$_("components.portal.licensing.AccountDowngradedModal.Please_updating")}
    </Body>
    {#if !$auth.user.accountPortalAccess}
      <Body
        >{$_("components.portal.licensing.AccountDowngradedModal.Please")}</Body
      >
    {/if}
  </ModalContent>
</Modal>

<style>
  .free-plan {
    font-weight: 600;
  }
</style>
