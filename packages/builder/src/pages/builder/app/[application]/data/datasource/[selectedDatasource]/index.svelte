<script>
  import { goto } from "@roxi/routify"
  import {
    Button,
    Heading,
    Body,
    Divider,
    Layout,
    notifications,
    Table,
    Modal,
  } from "@budibase/bbui"
  import { datasources, integrations, queries, tables } from "stores/backend"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import RestExtraConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/rest/RestExtraConfigForm.svelte"
  import PlusConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/PlusConfigForm.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import CapitaliseRenderer from "components/common/renderers/CapitaliseRenderer.svelte"
  import { IntegrationTypes } from "constants/backend"
  import { isEqual } from "lodash"
  import { cloneDeep } from "lodash/fp"
  import ImportRestQueriesModal from "components/backend/DatasourceNavigator/modals/ImportRestQueriesModal.svelte"

  let importQueriesModal

  let changed
  let integration, baseDatasource, datasource
  let queryList
  const querySchema = {
    name: {},
    queryVerb: { displayName: "Method" },
  }

  $: baseDatasource = $datasources.list.find(
    ds => ds._id === $datasources.selected
  )

  $: queryList = $queries.list.filter(
    query => query.datasourceId === datasource?._id
  )
  $: hasChanged(baseDatasource, datasource)
  $: updateDatasource(baseDatasource)

  function hasChanged(base, ds) {
    if (base && ds) {
      changed = !isEqual(base, ds)
    }
  }

  async function saveDatasource() {
    try {
      // Create datasource
      await datasources.save(datasource)
      if (datasource?.plus) {
        await tables.fetch()
      }
      await datasources.fetch()
      notifications.success(`Datasource ${name} updated successfully.`)
      baseDatasource = cloneDeep(datasource)
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
    }
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./${query._id}`)
  }

  function updateDatasource(base) {
    if (base) {
      datasource = cloneDeep(base)
      integration = $integrations[datasource.source]
    }
  }
</script>

<Modal bind:this={importQueriesModal}>
  {#if datasource.source === "REST"}
    <ImportRestQueriesModal
      createDatasource={false}
      datasourceId={datasource._id}
    />
  {/if}
</Modal>

{#if datasource && integration}
  <section>
    <Layout>
      <Layout gap="XS" noPadding>
        <header>
          <svelte:component
            this={ICONS[datasource.source]}
            height="26"
            width="26"
          />
          <Heading size="M">{datasource.name}</Heading>
        </header>
        <Body size="M">{integration.description}</Body>
      </Layout>
      <Divider />
      <div class="config-header">
        <Heading size="S">Configuration</Heading>
        <Button disabled={!changed} cta on:click={saveDatasource}>Save</Button>
      </div>
      <IntegrationConfigForm
        on:change={hasChanged}
        schema={integration.datasource}
        bind:datasource
      />
      {#if datasource.plus}
        <PlusConfigForm bind:datasource save={saveDatasource} />
      {/if}
      <Divider />
      <div class="query-header">
        <Heading size="S">Queries</Heading>
        <div class="query-buttons">
          {#if datasource?.source === IntegrationTypes.REST}
            <Button secondary on:click={() => importQueriesModal.show()}
              >Import</Button
            >
          {/if}
          <Button cta icon="Add" on:click={() => $goto("./new")}
            >Add query
          </Button>
        </div>
      </div>
      <Body size="S">
        To build an app using a datasource, you must first query the data. A
        query is a request for data or information from a datasource, for
        example a database table.
      </Body>
      {#if queryList && queryList.length > 0}
        <div class="query-list">
          <Table
            on:click={({ detail }) => onClickQuery(detail)}
            schema={querySchema}
            data={queryList}
            allowEditColumns={false}
            allowEditRows={false}
            allowSelectRows={false}
            customRenderers={[
              { column: "queryVerb", component: CapitaliseRenderer },
            ]}
          />
        </div>
      {/if}
      {#if datasource?.source === IntegrationTypes.REST}
        <RestExtraConfigForm
          queries={queryList}
          bind:datasource
          on:change={hasChanged}
        />
      {/if}
    </Layout>
  </section>
{/if}

<style>
  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 var(--spacing-xs) 0;
  }

  .query-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .query-buttons {
    display: flex;
    gap: var(--spacing-l);
  }

  .query-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
