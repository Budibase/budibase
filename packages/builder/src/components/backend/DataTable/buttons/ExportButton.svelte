<script>
  import { Button, Modal } from "@budibase/bbui"
  import ExportModal from "../modals/ExportModal.svelte"

  export let view

  let modal
</script>

<Button icon="Download" primary size="S" quiet on:click={modal.show}>
  Export
</Button>
<Modal bind:this={modal}>
  <ExportModal {view} />
</Modal>
