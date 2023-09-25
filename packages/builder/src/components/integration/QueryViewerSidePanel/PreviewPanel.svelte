<script>
  import Table from "components/backend/DataTable/Table.svelte"

  export let schema = {}
  export let rows = []
</script>

<Table {schema} data={rows} type="external" allowEditing={false} />
