<script>
  import { getContext } from "svelte"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { datasource, rows } = getContext("grid")
</script>

<CreateEditColumn
  on:updatecolumns={async () => {
    await datasource.actions.refreshDefinition()
    // Need to find a better way to handle formula columns than just always refreshing
    rows.actions.refreshData()
  }}
/>
