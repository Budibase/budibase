<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let datasourceId: string | undefined = undefined
  export let queryId: string | undefined = undefined
  export let restTemplateId: string | undefined = undefined
  export let saveAndClose: boolean = false
  export let redirectNewQueryOnSave: boolean = true
  export let connectionPopoverPortalTarget: string | undefined = undefined
  export let connectionPopoverZIndex: number | undefined = undefined

  export const confirmIfDirty = async () => true

  const dispatch = createEventDispatcher<{ savedQuery: { queryId: string } }>()

  const save = () => {
    dispatch("savedQuery", { queryId: "saved_query" })
  }
</script>

<div data-testid="api-endpoint-viewer">
  <span data-testid="api-endpoint-viewer-datasource">{datasourceId || ""}</span>
  <span data-testid="api-endpoint-viewer-query">{queryId || ""}</span>
  <span data-testid="api-endpoint-viewer-template">{restTemplateId || ""}</span>
  <span data-testid="api-endpoint-viewer-save-and-close"
    >{saveAndClose.toString()}</span
  >
  <span data-testid="api-endpoint-viewer-redirect-new-query"
    >{redirectNewQueryOnSave.toString()}</span
  >
  <span data-testid="api-endpoint-viewer-popover-target"
    >{connectionPopoverPortalTarget || ""}</span
  >
  <span data-testid="api-endpoint-viewer-popover-z-index"
    >{connectionPopoverZIndex || ""}</span
  >
  <button on:click={save}>Save request</button>
</div>
