<script>
  import { licensing, auth, temporalStore } from "@/stores/portal"
  import { onMount } from "svelte"
  import PaymentFailedModal from "./PaymentFailedModal.svelte"
  import AccountDowngradedModal from "./AccountDowngradedModal.svelte"
  import { ExpiringKeys } from "./constants"
  import { getBanners } from "./licensingBanners"
  import { banner } from "@budibase/bbui"

  const oneDayInSeconds = 86400

  let queuedBanners = []
  let queuedModals = []
  let paymentFailedModal
  let accountDowngradeModal
  let userLoaded = false
  let licensingLoaded = false
  let domLoaded = false
  let currentModalCfg = null

  const processModals = () => {
    const defaultCacheFn = key => {
      temporalStore.actions.setExpiring(key, {}, oneDayInSeconds)
    }

    const dismissableModals = [
      {
        key: ExpiringKeys.LICENSING_PAYMENT_FAILED,
        criteria: () => {
          return $licensing.accountPastDue && !$licensing.isFreePlan
        },
        action: () => {
          paymentFailedModal.show()
        },
        cache: () => {
          defaultCacheFn(ExpiringKeys.LICENSING_PAYMENT_FAILED)
        },
      },
      {
        key: ExpiringKeys.LICENSING_ACCOUNT_DOWNGRADED_MODAL,
        criteria: () => {
          return $licensing?.accountDowngraded
        },
        action: () => {
          accountDowngradeModal.show()
        },
        cache: () => {
          defaultCacheFn(ExpiringKeys.LICENSING_ACCOUNT_DOWNGRADED_MODAL)
        },
      },
    ]
    return dismissableModals.filter(modal => {
      return !temporalStore.actions.getExpiring(modal.key) && modal.criteria()
    })
  }

  const showNextModal = () => {
    if (currentModalCfg) {
      currentModalCfg.cache()
    }
    if (queuedModals.length) {
      currentModalCfg = queuedModals.shift()
      currentModalCfg.action()
    } else {
      currentModalCfg = null
    }
  }

  $: if (!userLoaded && $auth.user) {
    userLoaded = true
  }

  $: if (
    userLoaded &&
    $licensing.usageMetrics &&
    domLoaded &&
    !licensingLoaded
  ) {
    licensingLoaded = true
    queuedModals = processModals()
    queuedBanners = getBanners()
    showNextModal()
    banner.queue(queuedBanners)
  }

  onMount(async () => {
    domLoaded = true
  })
</script>

<PaymentFailedModal bind:this={paymentFailedModal} onDismiss={showNextModal} />
<AccountDowngradedModal
  bind:this={accountDowngradeModal}
  onDismiss={showNextModal}
/>
