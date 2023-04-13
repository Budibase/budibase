<script>
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import CreateEditColumn from "../CreateEditColumn.svelte"
  import { tables } from "stores/backend"

  const { rows, subscribe } = getContext("sheet")

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
