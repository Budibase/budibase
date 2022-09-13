<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { licensing, auth, admin } from "stores/portal"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let sessionsModal

  const outOfSessionsTitle = "You are almost out of sessions"
  const upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  $: daysRemaining = $licensing.quotaResetDaysRemaining
  $: sessionsUsed = $licensing.usageMetrics?.dayPasses

  export function show() {
    sessionsModal.show()
  }

  export function hide() {
    sessionsModal.hide()
  }
</script>

<Modal bind:this={sessionsModal} on:show={onShow} on:hide={onDismiss}>
  {#if $auth.user.accountPortalAccess}
    <ModalContent
      title={outOfSessionsTitle}
      size="M"
      confirmText="Upgrade"
      onConfirm={() => {
        window.location.href = upgradeUrl
      }}
    >
      <Body>
        You have used <span class="session_percent">{sessionsUsed}%</span> of
        your plans Day Passes with {daysRemaining} day{daysRemaining == 1
          ? ""
          : "s"} remaining.
      </Body>
      <Body>Upgrade your account to prevent your apps from going offline.</Body>
    </ModalContent>
  {:else}
    <ModalContent title={outOfSessionsTitle} size="M" showCancelButton={false}>
      <Body>
        You have used <span class="session_percent">{sessionsUsed}%</span> of
        your plans Day Passes with {daysRemaining} day{daysRemaining == 1
          ? ""
          : "s"} remaining.
      </Body>
      <Body>Please contact your account holder.</Body>
    </ModalContent>
  {/if}
</Modal>
