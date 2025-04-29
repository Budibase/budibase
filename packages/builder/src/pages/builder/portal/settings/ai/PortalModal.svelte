<script lang="ts">
  import { ModalContent, Link } from "@budibase/bbui"
  import { admin } from "@/stores/portal"

  export let confirmHandler: () => void
  export let cancelHandler: () => void
</script>

<ModalContent
  title="Setup BB AI"
  confirmText="Account portal"
  cancelText="Cancel"
  onConfirm={confirmHandler}
  onCancel={cancelHandler}
>
  <div>To setup BB AI you must add a Budibase license key.</div>

  <div class="link-container">
    To get your license key, account admins must sign up to the
    <Link href={$admin.accountPortalUrl}>Budibase Account Portal</Link>
  </div>
</ModalContent>

<style>
  .link-container {
    margin-top: calc(var(--spacing-xl) * -1);
  }
</style>
