<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ExportModal from "../modals/ExportModal.svelte"

  export let view
  export let disabled = false

  let modal
</script>

<ActionButton
  {disabled}
  icon="DataDownload"
  size="S"
  quiet
  on:click={modal.show}
>
  Export
</ActionButton>
<Modal bind:this={modal}>
  <ExportModal {view} />
</Modal>
