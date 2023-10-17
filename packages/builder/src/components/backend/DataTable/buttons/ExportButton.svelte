<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ExportModal from "../modals/ExportModal.svelte"

  export let view
  export let filters
  export let sorting
  export let disabled = false
  export let selectedRows
  export let formats

  let modal
</script>

<ActionButton {disabled} icon="DataDownload" quiet on:click={modal.show}>
  Export
</ActionButton>
<Modal bind:this={modal}>
  <ExportModal {view} {filters} {sorting} {selectedRows} {formats} />
</Modal>
