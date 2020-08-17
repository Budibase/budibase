<script>
  import { onMount } from "svelte"
  import fsort from "fast-sort"
  import getOr from "lodash/fp/getOr"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Button, Icon } from "@budibase/bbui"
  import Table from "./Table.svelte"
  import Select from "components/common/Select.svelte"
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

  const COLUMNS = [
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

  let data = []

  $: selectedView = $backendUiStore.selectedView
  $: !selectedView.name.startsWith("all_") && fetchViewData(selectedView)

  async function fetchViewData() {
    const QUERY_VIEW_URL = `/api/views/${$backendUiStore.selectedView.name}?stats=true`

    const response = await api.get(QUERY_VIEW_URL)
    data = await response.json()
  }
</script>

<Table title={decodeURI(selectedView.name)} columns={COLUMNS} {data}>
  <CalculationPopover view={selectedView} />
</Table>
