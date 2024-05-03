<script>
  import { ModalContent } from "@budibase/bbui"
  import FreeTrial from "../../../../assets/FreeTrial.svelte"

  export let onConfirm
</script>

<ModalContent
  confirmText="Get started"
  size="M"
  showCancelButton={false}
  showCloseIcon={false}
  {onConfirm}
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

<style>
  h1 {
    font-size: 26px;
  }
  .free-trial-text {
    font-size: 16px;
  }
</style>
