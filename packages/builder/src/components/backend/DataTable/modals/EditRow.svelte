<script>
  import { Modal, Button } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let row
  export let modalContentComponent = CreateEditRow

  let modal

  function showModal(e) {
    e.stopPropagation()
    modal.show()
  }
</script>

<Button secondary small on:click={showModal}
  >{$_("components.backend.DataTable.modals.EditRow.Edit")}</Button
>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} {row} />
</Modal>
