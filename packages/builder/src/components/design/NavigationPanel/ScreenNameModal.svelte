<script>
  import { ModalContent, Input } from "@budibase/bbui"

  export let modal
  export let navigationSelectionModal
  export let screenName
  $: console.log(name)
</script>

<ModalContent
  size="M"
  title={"hello"}
  confirmText={"Continue"}
  onCancel={() => modal.show()}
  onConfirm={() => navigationSelectionModal.show()}
  cancelText={"Back"}
  disabled={!screenName}
>
  <Input label="Name" bind:value={screenName} />
</ModalContent>
