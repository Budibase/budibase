<script>
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import CreateEditColumn from "../CreateEditColumn.svelte"

  const { rows, subscribe } = getContext("grid")

  let editableColumn
  let editColumnModal

  const editColumn = column => {
    editableColumn = column
    editColumnModal.show()
  }

  onMount(() => subscribe("edit-column", editColumn))
</script>

<Modal bind:this={editColumnModal}>
  <CreateEditColumn
    field={editableColumn}
    on:updatecolumns={rows.actions.refreshData}
  />
</Modal>
