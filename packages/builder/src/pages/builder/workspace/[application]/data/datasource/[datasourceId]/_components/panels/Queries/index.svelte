<script>
  import { goto } from "@roxi/routify"
  import { Button, Table, Modal } from "@budibase/bbui"
  import { queries } from "@/stores/builder"
  import CapitaliseRenderer from "@/components/common/renderers/CapitaliseRenderer.svelte"
  import RestImportButton from "./RestImportButton.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"
  import ViewImportSelection from "@/components/backend/Datasources/TableImportSelection/ViewImportSelection.svelte"

  export let datasource

  $: queryList = $queries.list.filter(
    query => query.datasourceId === datasource._id
  )

  let viewSelectionModal

  $: supportsViews = datasource.source === "POSTGRES"
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
      Create new query
    </Button>
    {#if supportsViews}
      <Button secondary on:click={viewSelectionModal.show}>Fetch views</Button>
    {/if}
    {#if datasource.source === "REST"}
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
    customRenderers={[{ column: "queryVerb", component: CapitaliseRenderer }]}
  />
</Panel>

<style>
  .controls {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
