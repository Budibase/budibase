<script>
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { rows, subscribe } = getContext("grid")

  let modal

  onMount(() => subscribe("add-column", modal.show))
</script>

<Modal bind:this={modal}>
  <CreateEditColumn on:updatecolumns={rows.actions.refreshTableDefinition} />
</Modal>
