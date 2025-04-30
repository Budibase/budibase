<script lang="ts">
  import { ModalContent, Link } from "@budibase/bbui"
  import { admin } from "@/stores/portal"

  export let confirmHandler: () => void
  export let cancelHandler: () => void
</script>

<ModalContent
  title="Set up Budibase AI"
  confirmText="Account portal"
  cancelText="Cancel"
  onConfirm={confirmHandler}
  onCancel={cancelHandler}
>
  <div>To set up Budibase AI you need a Budibase license key.</div>

  <div>
    To get your license key, an account admin must sign up to Budibase using the
    <Link href={$admin.accountPortalUrl}>Budibase Account Portal</Link>
  </div>

  <div>
    Either use an existing self-host workspace, or create a new one. Once you
    have signed up, you will be able to link your license key to this self-host
    installation by going to "Account" at the top of this page, and then
    "Upgrade" tab. Paste your license key in there, return to this page, and try
    again.
  </div>
</ModalContent>
