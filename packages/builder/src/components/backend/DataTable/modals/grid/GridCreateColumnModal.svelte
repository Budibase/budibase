<script>
import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"
import { getContext } from "svelte"

const { datasource } = getContext("grid")
</script>

<CreateEditColumn on:updatecolumns={datasource.actions.refreshDefinition} />
