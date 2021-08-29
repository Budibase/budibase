<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CalculateModal from "../modals/CalculateModal.svelte"
  import { _ as t } from "svelte-i18n"

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
  { $t('calculate') }
</ActionButton>
<Modal bind:this={modal}>
  <CalculateModal {view} />
</Modal>
