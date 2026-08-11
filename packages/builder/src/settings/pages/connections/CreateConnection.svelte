<script lang="ts">
  import { Button, Layout, Modal, Search, Table } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import ConnectRestTemplateRenderer from "./_components/ConnectRestTemplateRenderer.svelte"
  import ImportRestTemplateModal from "./_components/ImportRestTemplateModal.svelte"
  import RestTemplateActionsRenderer from "./_components/RestTemplateActionsRenderer.svelte"
  import RestTemplateIconRenderer from "./_components/RestTemplateIconRenderer.svelte"

  let searchValue = ""
  let templateModal: Modal
  let modalKey = 0

  const customRenderers = [
    { column: "icon", component: RestTemplateIconRenderer },
    { column: "connect", component: ConnectRestTemplateRenderer },
  ]
  const importedRenderers = [
    ...customRenderers,
    { column: "more", component: RestTemplateActionsRenderer },
  ]
  const importedSchema = {
    icon: { width: "40px" },
    name: { width: "200px" },
    description: { width: "1fr" },
    connect: { width: "100px", align: "Right" },
    more: { width: "40px", align: "Right" },
  }
  const prebuiltSchema = {
    icon: { width: "40px" },
    name: { width: "200px" },
    description: { width: "1fr" },
    connect: { width: "100px", align: "Right" },
  }

  $: locked = $bb.settings.locked

  $: importedTemplates = $restTemplates.templates
    .filter(template => template.custom)
    .sort((a, b) => a.name.localeCompare(b.name))
  $: prebuiltTemplates = $restTemplates.templates
    .filter(template => !template.custom)
    .filter(template =>
      searchValue
        ? template.name.toLowerCase().includes(searchValue.toLowerCase())
        : true
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const importSpec = () => {
    modalKey += 1
    templateModal.show()
  }
</script>

<Layout noPadding gap="XS">
  {#if locked}
    <RouteActions>
      <Button secondary on:click={() => bb.clearSettings()}>Cancel</Button>
    </RouteActions>
  {/if}

  <section>
    <div class="section-header">
      <div class="section-title">Imported API specs</div>
      {#if !locked}
        <Button icon="upload-simple" size="S" on:click={importSpec}>
          Import OpenAPI spec
        </Button>
      {/if}
    </div>

    {#if importedTemplates.length}
      <Table
        compact
        data={importedTemplates}
        schema={importedSchema}
        customRenderers={importedRenderers}
        hideHeader
        rounded
        allowClickRows={false}
        allowEditRows={false}
      />
    {/if}
  </section>

  <section>
    <div class="section-header">
      <div class="section-title">Pre-built OpenAPI templates</div>
      <div class="search">
        <Search
          placeholder="Search templates"
          value={searchValue}
          on:change={event => (searchValue = event.detail)}
        />
      </div>
    </div>

    <Table
      compact
      data={prebuiltTemplates}
      schema={prebuiltSchema}
      {customRenderers}
      hideHeader
      rounded
      allowClickRows={false}
      allowEditRows={false}
    />
  </section>
</Layout>

<Modal bind:this={templateModal}>
  {#key modalKey}
    <ImportRestTemplateModal
      onCancel={() => templateModal.hide()}
      onUploaded={() => templateModal.hide()}
    />
  {/key}
</Modal>

<style>
  section {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  section:first-child {
    margin-top: var(--spacing-l);
  }

  section + section {
    margin-top: var(--spacing-l);
  }

  section:last-child {
    gap: var(--spacing-l);
  }

  .section-header {
    display: flex;
    height: 24px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .search {
    width: 312px;
    max-width: 45%;
  }

  .search :global(.spectrum-Form-item) {
    width: 100%;
  }

  .section-title {
    color: var(--grey-7, #a2a2a2);
    font-size: 13px;
  }

  @media (max-width: 720px) {
    .search {
      width: 220px;
    }
  }
</style>
