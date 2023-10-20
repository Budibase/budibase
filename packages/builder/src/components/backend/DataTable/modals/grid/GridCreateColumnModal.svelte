<script>
  import { getContext } from "svelte"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { datasource } = getContext("grid")
</script>

<CreateEditColumn on:updatecolumns={datasource.actions.refreshDefinition} />
