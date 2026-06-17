<script lang="ts">
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"

  export let queryId: string | undefined = undefined
  export let datasourceId: string | undefined = undefined
  export let saveAndClose = false

  let savedQueryId = ""

  const handleSavedQuery = (event: CustomEvent<{ queryId: string }>) => {
    savedQueryId = event.detail.queryId
  }
</script>

<APIEndpointViewer
  {queryId}
  {datasourceId}
  {saveAndClose}
  on:savedQuery={handleSavedQuery}
/>

<span data-testid="saved-query-id">{savedQueryId}</span>
