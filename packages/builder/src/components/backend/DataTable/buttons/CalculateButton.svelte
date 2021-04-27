<script>
  import { Modal, Button } from "@budibase/bbui"
  import CalculateModal from "../modals/CalculateModal.svelte"

  export let view = {}

  let modal
</script>

<Button
  icon="Calculator"
  primary
  size="S"
  quiet
  on:click={modal.show}
  active={view.field && view.calculation}>
  Calculate
</Button>
<Modal bind:this={modal}>
  <CalculateModal {view} />
</Modal>
