<script>
  import { _ } from "../../../../../../../../lang/i18n"
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

  const querySchema = {
    name: {},
    queryVerb: {
      displayName: $_(
        "pages.builder.app.application.data.datasource.datasourceId.index.Method"
      ),
    },
  }

  let importQueriesModal
  let changed = false
  let isValid = true
  let integration, baseDatasource, datasource
  let queryList

  $: baseDatasource = $datasources.selected
  $: queryList = $queries.list.filter(
    query => query.datasourceId === datasource?._id
  )
  $: hasChanged(baseDatasource, datasource)
  $: updateDatasource(baseDatasource)

  const hasChanged = (base, ds) => {
    if (base && ds) {
      changed = !isEqual(base, ds)
    }
  }

  const saveDatasource = async () => {
    try {
      // Create datasource
      await datasources.save(datasource)
      if (datasource?.plus) {
        await tables.fetch()
      }
      await datasources.fetch()
      notifications.success(
        `${$_(
          "pages.builder.app.application.data.datasource.datasourceId.index.Datasource"
        )} ${name} ${$_(
          "pages.builder.app.application.data.datasource.datasourceId.index.updated_successfully"
        )}.`
      )
      baseDatasource = cloneDeep(datasource)
    } catch (err) {
      notifications.error(
        `${$_(
          "pages.builder.app.application.data.datasource.datasourceId.index.Error_saving"
        )}: ${err}`
      )
    }
  }

  const updateDatasource = base => {
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
    <Layout noPadding>
      <Layout gap="XS" noPadding>
        <header>
          <svelte:component
            this={ICONS[datasource.source]}
            height="26"
            width="26"
          />
          <Heading size="M">{$datasources.selected?.name}</Heading>
        </header>
        <Body size="M">{integration.description}</Body>
      </Layout>
      <Divider />
      <div class="config-header">
        <Heading size="S"
          >{$_(
            "pages.builder.app.application.data.datasource.datasourceId.index.Configuration"
          )}</Heading
        >
        <Button disabled={!changed || !isValid} cta on:click={saveDatasource}>
          {$_(
            "pages.builder.app.application.data.datasource.datasourceId.index.Save"
          )}
        </Button>
      </div>
      <IntegrationConfigForm
        on:change={hasChanged}
        schema={integration.datasource}
        bind:datasource
        on:valid={e => (isValid = e.detail)}
      />
      {#if datasource.plus}
        <PlusConfigForm bind:datasource save={saveDatasource} />
      {/if}
      <Divider />
      <div class="query-header">
        <Heading size="S"
          >{$_(
            "pages.builder.app.application.data.datasource.datasourceId.index.Queries"
          )}</Heading
        >
        <div class="query-buttons">
          {#if datasource?.source === IntegrationTypes.REST}
            <Button secondary on:click={() => importQueriesModal.show()}>
              {$_(
                "pages.builder.app.application.data.datasource.datasourceId.index.Import"
              )}
            </Button>
          {/if}
          <Button
            cta
            icon="Add"
            on:click={() => $goto(`../../query/new/${datasource._id}`)}
          >
            {$_(
              "pages.builder.app.application.data.datasource.datasourceId.index.Add_query"
            )}
          </Button>
        </div>
      </div>
      <Body size="S">
        {$_(
          "pages.builder.app.application.data.datasource.datasourceId.index.Body"
        )}
      </Body>
      {#if queryList && queryList.length > 0}
        <div class="query-list">
          <Table
            on:click={({ detail }) => $goto(`../../query/${detail._id}`)}
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
