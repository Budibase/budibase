<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let highlighted = false
  export let disabled = false

  let modal
</script>

<ActionButton
  {disabled}
  selected={highlighted}
  emphasized={highlighted}
  icon="TableColumnAddRight"
  quiet
  size="S"
  on:click={modal.show}
>
  {$_("components.backend.DataTable.buttons.CreateColumnButton.Create_column")}
</ActionButton>
<Modal bind:this={modal}>
  <CreateEditColumn on:updatecolumns />
</Modal>
