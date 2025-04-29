<script lang="ts">
  import { ModalContent, Body, Link } from "@budibase/bbui"
  import { admin } from "@/stores/portal"

  export let confirmHandler: () => void
  export let cancelHandler: () => void
</script>

<ModalContent
  title="Setup BB AI"
  confirmText="Go to Portal"
  cancelText="Cancel"
  onConfirm={confirmHandler}
  onCancel={cancelHandler}
>
  <Body>To setup BB AI you must add a Budibase license key.</Body>
  <Body>
    To get your license key, account admins must sign up to the
    <Link href={$admin.accountPortalUrl}>Budibase Account Portal</Link>
  </Body>
</ModalContent>
