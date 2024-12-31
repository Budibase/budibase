<script>
  import { Modal, ModalContent } from "@budibase/bbui"
  import FreeTrial from "../../../../assets/FreeTrial.svelte"
  import { get } from "svelte/store"
  import { auth, licensing, admin } from "@/stores/portal"
  import { API } from "@/api"
  import { PlanType } from "@budibase/types"

  let freeTrialModal

  $: planType = $licensing?.license?.plan?.type
  $: showFreeTrialModal(planType, freeTrialModal)
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  const showFreeTrialModal = (planType, freeTrialModal) => {
    if (
      planType === PlanType.ENTERPRISE_BASIC_TRIAL &&
      !$auth.user?.freeTrialConfirmedAt &&
      isOwner
    ) {
      freeTrialModal?.show()
    }
  }
</script>

<Modal bind:this={freeTrialModal} disableCancel={true}>
  <ModalContent
    confirmText="Get started"
    size="M"
    showCancelButton={false}
    showCloseIcon={false}
    onConfirm={async () => {
      if (get(auth).user) {
        try {
          await API.updateSelf({
            freeTrialConfirmedAt: new Date().toISOString(),
          })
          // Update the cached user
          await auth.getSelf()
        } finally {
          freeTrialModal.hide()
        }
      }
    }}
  >
    <h1>Experience all of Budibase with a free 14-day trial</h1>
    <div class="free-trial-text">
      We've upgraded you to a free 14-day trial that allows you to try all our
      features before deciding which plan is right for you.
      <p>
        At the end of your trial, we'll automatically downgrade you to the Free
        plan unless you choose to upgrade.
      </p>
    </div>
    <FreeTrial />
  </ModalContent>
</Modal>

<style>
  h1 {
    font-size: 26px;
  }
  .free-trial-text {
    font-size: 16px;
  }
</style>
