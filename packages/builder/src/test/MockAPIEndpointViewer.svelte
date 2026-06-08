<script lang="ts">
  export let datasourceId: string | undefined = undefined
  export let queryId: string | undefined = undefined

  export const confirmIfDirty = async () => true
</script>

<div data-testid="api-endpoint-viewer">
  <span data-testid="api-endpoint-viewer-datasource">{datasourceId || ""}</span>
  <span data-testid="api-endpoint-viewer-query">{queryId || ""}</span>
</div>
