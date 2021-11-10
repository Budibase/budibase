<script>
  import { ModalContent, Input } from "@budibase/bbui"

  export let modal
  export let navigationSelectionModal
  export let name
</script>

<ModalContent
  size="M"
  title={"hello"}
  confirmText={"Continue"}
  onCancel={() => modal.show()}
  onConfirm={() => navigationSelectionModal.show()}
  cancelText={"Back"}
  disabled={!name.length}
>
  <Input label="Name" bind:value={name} />
</ModalContent>
