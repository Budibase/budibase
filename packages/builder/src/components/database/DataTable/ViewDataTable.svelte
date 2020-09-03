<script>
  import { onMount } from "svelte"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import Table from "./Table.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import LinkedRecord from "./LinkedRecord.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal, CreateEditRecordModal } from "./modals"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ViewPopover from "./popovers/View.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnHeader.svelte"
  import EditRowPopover from "./popovers/EditRow.svelte"
  import CalculationPopover from "./popovers/Calculate.svelte"
  import GroupByPopover from "./popovers/GroupBy.svelte"
  import FilterPopover from "./popovers/Filter.svelte"

  export let view = {}

  let data = []

  $: name = view.name
  $: filters = view.filters
  $: field = view.field
  $: groupBy = view.groupBy
  $: !name.startsWith("all_") && filters && fetchViewData(name, field, groupBy)

  async function fetchViewData(name, field, groupBy) {
    const params = new URLSearchParams()

    if (field) {
      params.set("field", field)
      params.set("stats", true)
    }
    if (groupBy) params.set("group", groupBy)

    let QUERY_VIEW_URL = `/api/views/${name}?${params}`

    const response = await api.get(QUERY_VIEW_URL)
    data = await response.json()
  }
</script>

<Table title={decodeURI(name)} schema={view.schema} {data}>
  <FilterPopover {view} />
  <CalculationPopover {view} />
  {#if view.calculation}
    <GroupByPopover {view} />
  {/if}
</Table>
