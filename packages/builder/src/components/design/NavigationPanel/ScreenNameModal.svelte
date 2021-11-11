<script>
  import { ModalContent, Input } from "@budibase/bbui"

  export let modal
  export let navigationSelectionModal
  export let screenName
</script>

<ModalContent
  size="M"
  title={"Enter name"}
  confirmText={"Continue"}
  onCancel={() => modal.show()}
  onConfirm={() => navigationSelectionModal.show()}
  cancelText={"Back"}
  disabled={!screenName}
>
  <Input label="Name" bind:value={screenName} />
</ModalContent>
