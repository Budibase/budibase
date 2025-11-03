<script>
  import { goto } from "@roxi/routify"
  import { Button, Table, Modal } from "@budibase/bbui"
  import { queries } from "@/stores/builder"
  import QueryVerbRenderer from "@/components/common/renderers/QueryVerbRenderer.svelte"
  import CapitaliseRenderer from "@/components/common/renderers/CapitaliseRenderer.svelte"
  import RestImportButton from "./RestImportButton.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"
  import ViewImportSelection from "@/components/backend/Datasources/TableImportSelection/ViewImportSelection.svelte"
  import { IntegrationTypes } from "@/constants/backend"

  export let datasource

  $: queryList = $queries.list.filter(
    query => query.datasourceId === datasource._id
  )

  let viewSelectionModal

  $: supportsViews =
    datasource.source === "POSTGRES" || datasource.source === "MYSQL"
  $: methodRenderer =
    datasource?.source === IntegrationTypes.REST
      ? QueryVerbRenderer
      : CapitaliseRenderer
  $: isRestDatasource = datasource?.source === "REST"
  $: showImportButton = isRestDatasource && !datasource?.isRestTemplate
  $: createQueryLabel = isRestDatasource ? "Add action" : "Create new query"
</script>

{#if supportsViews}
  <Modal bind:this={viewSelectionModal}>
    <ViewImportSelection
      {datasource}
      onComplete={() => {
        viewSelectionModal.hide()
        queries.fetch()
      }}
    />
  </Modal>
{/if}

<Panel>
  <div class="controls" slot="controls">
    <Button cta on:click={() => $goto(`../../query/new/${datasource._id}`)}>
      {createQueryLabel}
    </Button>
    {#if supportsViews}
      <Button secondary on:click={viewSelectionModal.show}>Fetch views</Button>
    {/if}
    {#if showImportButton}
      <RestImportButton datasourceId={datasource._id} />
    {/if}
  </div>
  <Tooltip
    slot="tooltip"
    title="Custom queries"
    href="https://docs.budibase.com/docs/data-sources#custom-queries "
  />
  <Table
    on:click={({ detail }) => $goto(`../../query/${detail._id}`)}
    schema={{
      name: {},
      queryVerb: { displayName: "Method" },
    }}
    data={queryList}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
    customRenderers={[{ column: "queryVerb", component: methodRenderer }]}
  />
</Panel>

<style>
  .controls {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
