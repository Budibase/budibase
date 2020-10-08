<script>
  import { backendUiStore } from "builderStore"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import * as api from "./api"
  import Table from "./Table.svelte"

  let data = []
  let loading = false

  $: title = $backendUiStore.selectedModel.name
  $: schema = $backendUiStore.selectedModel.schema
  $: modelView = {
    schema,
    name: $backendUiStore.selectedView.name,
  }

  // Fetch records for specified model
  $: {
    if ($backendUiStore.selectedView?.name?.startsWith("all_")) {
      loading = true
      api.fetchDataForView($backendUiStore.selectedView).then(records => {
        data = records || []
        loading = false
      })
    }
  }
</script>

<Table {title} {schema} {data} allowEditing={true} {loading}>
  <CreateColumnButton />
  {#if Object.keys(schema).length > 0}
    <CreateRowButton />
    <CreateViewButton />
    <ExportButton view={modelView} />
  {/if}
</Table>
