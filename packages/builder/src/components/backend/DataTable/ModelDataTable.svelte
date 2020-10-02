<script>
  import { backendUiStore } from "builderStore"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
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
  <CreateColumnButton />
  {#if Object.keys(schema).length > 0}
    <CreateRowButton />
    <CreateViewButton />
  {/if}
</Table>
