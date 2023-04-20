<script>
  import { _ } from "../../../../lang/i18n"
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
    title={$_("components.portal.licensing.AppLimitModal.Upgrade_to")}
    size="M"
    showCancelButton={false}
    confirmText={$auth.user.accountPortalAccess
      ? $_("components.portal.licensing.AppLimitModal.Upgrade")
      : $_("components.portal.licensing.AppLimitModal.Confirm")}
    onConfirm={$auth.user.accountPortalAccess
      ? () => {
          window.location.href = upgradeUrl
        }
      : null}
  >
    <Body>
      {$_("components.portal.licensing.AppLimitModal.You")}<span
        class="free-plan"
        >{$_("components.portal.licensing.AppLimitModal.Free")}</span
      >. {$_("components.portal.licensing.AppLimitModal.Pro")}
    </Body>
    {#if !$auth.user.accountPortalAccess}
      <Body>{$_("components.portal.licensing.AppLimitModal.Please")}</Body>
    {/if}
  </ModalContent>
</Modal>

<style>
  .free-plan {
    font-weight: 600;
  }
</style>
