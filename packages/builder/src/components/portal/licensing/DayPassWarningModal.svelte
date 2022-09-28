<script>
  import { Modal, ModalContent, Body, TooltipWrapper } from "@budibase/bbui"
  import { licensing, auth, admin } from "stores/portal"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let dayPassModal

  $: accountUrl = $admin.accountPortalUrl
  $: upgradeUrl = `${accountUrl}/portal/upgrade`

  $: daysRemaining = $licensing.quotaResetDaysRemaining
  $: quotaResetDate = $licensing.quotaResetDate
  $: dayPassesUsed =
    $licensing.usageMetrics?.dayPasses > 100
      ? 100
      : $licensing.usageMetrics?.dayPasses
  $: dayPassesTitle =
    dayPassesUsed >= 100
      ? "You have run out of Day Passes"
      : "You are almost out of Day Passes"
  $: dayPassesBody =
    dayPassesUsed >= 100
      ? "Upgrade your account to bring your apps back online."
      : "Upgrade your account to prevent your apps from going offline."

  export function show() {
    dayPassModal.show()
  }

  export function hide() {
    dayPassModal.hide()
  }
</script>

<Modal bind:this={dayPassModal} on:show={onShow} on:hide={onDismiss}>
  {#if $auth.user.accountPortalAccess}
    <ModalContent
      title={dayPassesTitle}
      size="M"
      confirmText="Upgrade"
      onConfirm={() => {
        window.location.href = upgradeUrl
      }}
    >
      <Body>
        You have used <span class="daypass_percent">{dayPassesUsed}%</span> of
        your plans Day Passes with {daysRemaining} day{daysRemaining == 1
          ? ""
          : "s"} remaining.
        <span class="tooltip">
          <TooltipWrapper tooltip={quotaResetDate} size="S" />
        </span>
      </Body>
      <Body>{dayPassesBody}</Body>
    </ModalContent>
  {:else}
    <ModalContent title={dayPassesTitle} size="M" showCancelButton={false}>
      <Body>
        You have used <span class="daypass_percent">{dayPassesUsed}%</span> of
        your plans Day Passes with {daysRemaining} day{daysRemaining == 1
          ? ""
          : "s"} remaining.
        <span class="tooltip">
          <TooltipWrapper tooltip={quotaResetDate} size="S" />
        </span>
      </Body>
      <Body>Please contact your account holder to upgrade.</Body>
    </ModalContent>
  {/if}
</Modal>

<style>
  .tooltip {
    display: inline-block;
  }
  .tooltip :global(.icon-container) {
    margin: 0px;
  }
</style>
