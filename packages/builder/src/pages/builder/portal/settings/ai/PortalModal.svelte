<script lang="ts">
  import { ModalContent, Body } from "@budibase/bbui"
  /**
   * URL to the account portal where Budibase AI can be enabled.
   */
  export let url: string
  /**
   * Handler for the confirm action (Go to Portal).
   */
  export let confirmHandler: () => void
  /**
   * Handler for the cancel action.
   */
  export let cancelHandler: () => void
</script>

<ModalContent
  title="Enable Budibase AI"
  confirmText="Go to Portal"
  cancelText="Cancel"
  onConfirm={confirmHandler}
  onCancel={cancelHandler}
>
  <Body>
    To enable Budibase AI, please visit your account portal.
  </Body>
</ModalContent>