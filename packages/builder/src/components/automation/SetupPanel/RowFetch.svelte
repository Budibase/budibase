<script lang="ts">
  import { API } from "@/api"
  import { tables } from "@/stores/builder"
  import { type TableDatasource, SortOrder } from "@budibase/types"
  import { fetchData } from "@budibase/frontend-core"
  import type TableFetch from "@budibase/frontend-core/src/fetch/TableFetch"
  import { Select } from "@budibase/bbui"

  export let tableId: string | undefined

  let datasource: TableDatasource
  let fetch: TableFetch | undefined
  let rowSearchTerm = ""
  let selectedRow

  $: primaryDisplay = table?.primaryDisplay

  $: table = tableId
    ? $tables.list.find(table => table._id === tableId)
    : undefined

  $: if (table && tableId) {
    datasource = { type: "table", tableId }
    fetch = createFetch(datasource)
  }

  $: if (rowSearchTerm && primaryDisplay) {
    fetch?.update({
      query: {
        fuzzy: {
          [primaryDisplay]: rowSearchTerm || "",
        },
      },
    })
  }

  const createFetch = (datasource: TableDatasource) => {
    if (!datasource || !primaryDisplay) {
      return
    }

    return fetchData({
      API,
      datasource,
      options: {
        sortColumn: primaryDisplay,
        sortOrder: SortOrder.ASCENDING,
        query: {
          fuzzy: {
            [primaryDisplay]: rowSearchTerm || "",
          },
        },
        limit: 20,
      },
    })
  }

  $: fetchedRows = fetch ? $fetch?.rows : []
  $: fetchLoading = fetch ? $fetch?.loading : false

  const compare = (a: any, b: any) => {
    primaryDisplay && a?.[primaryDisplay] === b?.[primaryDisplay]
  }
</script>

<Select
  placeholder={"Select a row"}
  options={fetchedRows}
  loading={fetchLoading}
  value={selectedRow}
  autocomplete={true}
  getOptionLabel={row => (primaryDisplay ? row?.[primaryDisplay] : "")}
  {compare}
/>
