<script>
  import { ModalContent, Body } from "@budibase/bbui"

  export let datasource
  export let onConfirm
  export let prevModal

  export let selected = []
</script>

<ModalContent
  title={`Fetch your tables`}
  {onConfirm}
  onCancel={() => prevModal.show()}
  confirmText="Continue"
  cancelText="Back"
  size="L"
  disabled={selected.length === 0}
>
  <Body>SOME TABLES HERE</Body>
</ModalContent>
