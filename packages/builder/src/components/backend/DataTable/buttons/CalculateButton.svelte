<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CalculateModal from "../modals/CalculateModal.svelte"

  export let view = {}

  let modal
</script>

<ActionButton
  icon="Calculator"
  quiet
  on:click={modal.show}
  active={view.field && view.calculation}
>
  Calculate
</ActionButton>
<Modal bind:this={modal}>
  <CalculateModal {view} />
</Modal>
