<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ExportModal from "../modals/ExportModal.svelte"

  export let view

  let modal
</script>

<ActionButton icon="DataDownload" size="S" quiet on:click={modal.show}>
  Export
</ActionButton>
<Modal bind:this={modal}>
  <ExportModal {view} />
</Modal>
