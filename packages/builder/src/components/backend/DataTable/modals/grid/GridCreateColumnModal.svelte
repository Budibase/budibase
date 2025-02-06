<script>
  import { getContext } from "svelte"
  import CreateEditColumn from "@/components/backend/DataTable/modals/CreateEditColumn.svelte"

  const { datasource, rows } = getContext("grid")

  const onUpdate = async () => {
    await datasource.actions.refreshDefinition()
    await rows.actions.refreshData()
  }
</script>

<CreateEditColumn on:updatecolumns={onUpdate} />
