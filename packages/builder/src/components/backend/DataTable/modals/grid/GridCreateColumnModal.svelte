<script>
  import { getContext } from "svelte"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { rows } = getContext("grid")
</script>

<CreateEditColumn on:updatecolumns={rows.actions.refreshTableDefinition} />
