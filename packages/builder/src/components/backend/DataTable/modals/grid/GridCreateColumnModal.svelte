<script>
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { rows, subscribe } = getContext("grid")

  let modal

  onMount(() => subscribe("add-column", modal.show))
</script>

<Modal bind:this={modal}>
  <CreateEditColumn
    on:updatecolumns={rows.actions.refreshTableDefinition}
    on:updatetables={() => {
      tables.fetch()
    }}
  />
</Modal>
