<script>
  import { goto } from "@roxi/routify"
  import { Button, Table, Modal } from "@budibase/bbui"
  import { queries } from "@/stores/builder"
  import CapitaliseRenderer from "@/components/common/renderers/CapitaliseRenderer.svelte"
  import RestImportButton from "./RestImportButton.svelte"
  import RestImportQueriesModal from "./RestImportQueriesModal.svelte"
  import RestTemplateImportModal from "./RestTemplateImportModal.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"
  import ViewImportSelection from "@/components/backend/Datasources/TableImportSelection/ViewImportSelection.svelte"

  $goto

  export let datasource

  $: queryList = $queries.list.filter(
    query => query.datasourceId === datasource._id
  )

  let viewSelectionModal
  let restImportModal

  $: supportsViews =
    datasource.source === "POSTGRES" || datasource.source === "MYSQL"
  $: isRestDatasource = datasource?.source === "REST"
  $: isTemplateDatasource = Boolean(datasource?.restTemplate)
  $: showImportButton = isRestDatasource && !isTemplateDatasource
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

{#if isRestDatasource}
  <Modal bind:this={restImportModal}>
    {#if isTemplateDatasource}
      <RestTemplateImportModal
        datasourceId={datasource._id}
        createDatasource={false}
      />
    {:else}
      <RestImportQueriesModal
        datasourceId={datasource._id}
        createDatasource={false}
      />
    {/if}
  </Modal>
{/if}

<Panel>
  <div class="controls" slot="controls">
    <Button cta on:click={() => $goto(`../../query/new/${datasource._id}`)}>
      {createQueryLabel}
    </Button>
    <slot name="global-save" />
    {#if supportsViews}
      <Button secondary on:click={viewSelectionModal.show}>Fetch views</Button>
    {/if}
    {#if showImportButton}
      <RestImportButton datasourceId={datasource._id} />
    {/if}
  </div>
  <svelte:fragment slot="tooltip">
    {#if !isRestDatasource}
      <Tooltip
        title="Custom queries"
        href="https://docs.budibase.com/docs/data-sources#custom-queries "
      />
    {/if}
  </svelte:fragment>
  {#if !isRestDatasource}
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
      customRenderers={[{ column: "queryVerb", component: CapitaliseRenderer }]}
    />
  {/if}
</Panel>

<style>
  .controls {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
