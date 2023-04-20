<script>
  import { _ } from "../../../../lang/i18n"
  import { Modal, ModalContent, Body, TooltipWrapper } from "@budibase/bbui"
  import { auth, admin, licensing } from "stores/portal"
  import { onMount } from "svelte"

  export let onDismiss = () => {}
  export let onShow = () => {}

  let paymentFailedModal
  let pastDueEndDate

  const paymentFailedTitle = $_(
    "components.portal.licensing.PaymentFailedModal.Payment_failed"
  )
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
      confirmText={$_("components.portal.licensing.PaymentFailedModal.Billing")}
      onConfirm={() => {
        window.location.href = billingUrl
      }}
    >
      <Body>{$_("components.portal.licensing.PaymentFailedModal.The")}</Body>
      <Body>
        {$_("components.portal.licensing.PaymentFailedModal.Please_update")}
      </Body>
      <Body weight={800}>
        <div class="tooltip-root">
          {`${$licensing.pastDueDaysRemaining} ${$_(
            "components.portal.licensing.licensingBanners.day"
          )}${$licensing.pastDueDaysRemaining == 1 ? "" : "s"} ${$_(
            "components.portal.licensing.licensingBanners.remaining"
          )}`}
          <span class="tooltip">
            <TooltipWrapper tooltip={pastDueEndDate} size="S" />
          </span>
        </div>
      </Body>
    </ModalContent>
  {:else}
    <ModalContent title={paymentFailedTitle} size="M" showCancelButton={false}>
      <Body>{$_("components.portal.licensing.PaymentFailedModal.The")}</Body>
      <Body>
        {$_("components.portal.licensing.PaymentFailedModal.Please_update")}
      </Body>
      <Body
        >{$_(
          "components.portal.licensing.PaymentFailedModal.Please_contact"
        )}</Body
      >
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
