<script lang="ts">
  import { ModalContent, Link } from "@budibase/bbui"
  import { admin } from "@/stores/portal/admin"

  interface Props {
    confirmHandler: () => void
    cancelHandler: () => void
  }

  let { confirmHandler, cancelHandler }: Props = $props()
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
    Get your key from the
    <Link
      href={$admin.accountPortalUrl}
      target="_blank"
      rel="noopener noreferrer">Budibase Account Portal</Link
    > then add it to your self-hosted instance via the Account → Upgrade page.
  </div>

  <div>
    <Link
      href="https://docs.budibase.com/docs/quickstart-budibase-ai"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more about this step.
    </Link>
  </div>
</ModalContent>
