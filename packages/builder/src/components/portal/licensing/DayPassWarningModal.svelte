<script>
  import { _ } from "../../../../lang/i18n"
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
      ? $_("components.portal.licensing.DayPassWarningModal.You_have")
      : $_("components.portal.licensing.DayPassWarningModal.You_are")
  $: dayPassesBody =
    dayPassesUsed >= 100
      ? $_("components.portal.licensing.DayPassWarningModal.Online")
      : $_("components.portal.licensing.DayPassWarningModal.Offline")

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
        {$_("components.portal.licensing.DayPassWarningModal.used")}
        <span class="daypass_percent">{dayPassesUsed}%</span>
        {$_("components.portal.licensing.DayPassWarningModal.of")}
        {daysRemaining}
        {$_(
          "components.portal.licensing.DayPassWarningModal.day"
        )}{daysRemaining == 1 ? "" : "s"}
        {$_("components.portal.licensing.DayPassWarningModal.remaining")}
        <span class="tooltip">
          <TooltipWrapper tooltip={quotaResetDate} size="S" />
        </span>
      </Body>
      <Body>{dayPassesBody}</Body>
    </ModalContent>
  {:else}
    <ModalContent title={dayPassesTitle} size="M" showCancelButton={false}>
      <Body>
        {$_("components.portal.licensing.DayPassWarningModal.used")}
        <span class="daypass_percent">{dayPassesUsed}%</span>
        {$_("components.portal.licensing.DayPassWarningModal.of")}
        {daysRemaining}
        {$_(
          "components.portal.licensing.DayPassWarningModal.day"
        )}{daysRemaining == 1 ? "" : "s"}
        {$_("components.portal.licensing.DayPassWarningModal.remaining")}
        <span class="tooltip">
          <TooltipWrapper tooltip={quotaResetDate} size="S" />
        </span>
      </Body>
      <Body>{$_("components.portal.licensing.DayPassWarningModal.Please")}</Body
      >
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
