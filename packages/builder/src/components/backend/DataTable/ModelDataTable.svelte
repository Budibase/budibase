<script>
  import { backendUiStore } from "builderStore"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ViewPopover from "./popovers/View.svelte"
  import * as api from "./api"
  import Table from "./Table.svelte"

  let data = []

  $: title = $backendUiStore.selectedModel.name
  $: schema = $backendUiStore.selectedModel.schema

  // Fetch records for specified model
  $: {
    if ($backendUiStore.selectedView?.name?.startsWith("all_")) {
      api.fetchDataForView($backendUiStore.selectedView).then(records => {
        data = records || []
      })
    }
  }
</script>

<Table {title} {schema} {data} allowEditing={true}>
  <ColumnPopover />
  {#if Object.keys(schema).length > 0}
    <RowPopover />
    <ViewPopover />
  {/if}
</Table>
