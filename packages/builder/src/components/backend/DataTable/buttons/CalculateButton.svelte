<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CalculateModal from "../modals/CalculateModal.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let view = {}

  let modal
</script>

<ActionButton
  icon="Calculator"
  size="S"
  quiet
  on:click={modal.show}
  active={view.field && view.calculation}
>
  {$_("components.backend.DataTable.buttons.CaltulcateButton.Calculate")}
</ActionButton>
<Modal bind:this={modal}>
  <CalculateModal {view} />
</Modal>
