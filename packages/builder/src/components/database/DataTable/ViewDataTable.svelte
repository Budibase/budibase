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

  let COLUMNS = [
    {
      name: "group",
      key: "key",
      default: "All Records",
    },
    {
      name: "sum",
      key: "value.sum",
    },
    {
      name: "min",
      key: "value.min",
    },
    {
      name: "max",
      key: "value.max",
    },
    {
      name: "sumsqr",
      key: "value.sumsqr",
    },
    {
      name: "count",
      key: "value.count",
    },
    {
      name: "avg",
      key: "value.avg",
    },
  ]

  export let view = {}

  let data = []

  $: ({ name, groupBy, filters } = view)
  $: !name.startsWith("all_") && filters && fetchViewData(name, groupBy)

  async function fetchViewData(name, groupBy) {
    let QUERY_VIEW_URL = `/api/views/${name}?stats=true`
    if (groupBy) {
      QUERY_VIEW_URL += `&group=${groupBy}`
    }

    const response = await api.get(QUERY_VIEW_URL)
    data = await response.json()
  }
</script>

<Table title={decodeURI(view.name)} columns={COLUMNS} {data}>
  <FilterPopover {view} />
  <CalculationPopover {view} />
  <GroupByPopover {view} />
</Table>
