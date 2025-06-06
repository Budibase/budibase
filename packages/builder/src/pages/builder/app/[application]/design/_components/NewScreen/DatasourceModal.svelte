<script lang="ts">
  import { Body, ModalContent, Layout } from "@budibase/bbui"
  import { datasources as datasourcesStore } from "@/stores/builder"
  import ICONS from "@/components/backend/DatasourceNavigator/icons"
  import { IntegrationNames } from "@/constants"
  import { createEventDispatcher } from "svelte"
  import TableOrViewOption from "./TableOrViewOption.svelte"
  import type { SourceOption } from "./utils"
  import { makeTableOption, makeViewOption } from "./utils"
  import type { Datasource, Table, UIInternalDatasource } from "@budibase/types"
  import { helpers } from "@budibase/shared-core"

  export let onConfirm: () => Promise<void>
  export let selectedTablesAndViews: SourceOption[]

  const dispatch = createEventDispatcher()

  const getViews = (table: Table) => {
    const views = Object.values(table.views || {}).filter(helpers.views.isV2)
    return views.map(makeViewOption)
  }

  const getTablesAndViews = (
    datasource: Datasource | UIInternalDatasource,
    datasources: (Datasource | UIInternalDatasource)[]
  ) => {
    let tablesAndViews: SourceOption[] = []
    const tables = Array.isArray(datasource.entities)
      ? datasource.entities
      : Object.values(datasource.entities ?? {})

    for (const table of tables) {
      if (table._id === "ta_users") {
        continue
      }

      const formattedTable = makeTableOption(table, datasources)

      tablesAndViews = tablesAndViews.concat([
        formattedTable,
        ...getViews(table),
      ])
    }

    return tablesAndViews
  }

  const getDatasources = (
    rawDatasources: (Datasource | UIInternalDatasource)[]
  ) => {
    const datasources = []

    for (const rawDatasource of rawDatasources) {
      if (
        rawDatasource.source === IntegrationNames.REST ||
        !rawDatasource["entities"]
      ) {
        continue
      }

      const datasource = {
        name: rawDatasource.name,
        iconComponent: ICONS[rawDatasource.source],
        tablesAndViews: getTablesAndViews(rawDatasource, rawDatasources),
      }

      datasources.push(datasource)
    }

    return datasources
  }

  $: datasources = getDatasources($datasourcesStore.list)

  const toggleSelection = (tableOrView: SourceOption) => {
    dispatch("toggle", tableOrView)
  }
</script>

<ModalContent
  title="Autogenerated screens"
  confirmText="Next"
  cancelText="Back"
  {onConfirm}
  disabled={!selectedTablesAndViews.length}
  size="L"
>
  <Body size="S">
    Select which datasources you would like to use to create your screens
  </Body>
  <Layout noPadding gap="S">
    {#each datasources as datasource}
      <div class="datasource">
        <div class="header">
          <svelte:component
            this={datasource.iconComponent}
            height="18"
            width="18"
          />
          <h2>{datasource.name}</h2>
        </div>
        <!-- List all tables -->
        {#each datasource.tablesAndViews as tableOrView}
          {@const selected = selectedTablesAndViews.some(
            selected => selected.id === tableOrView.id
          )}
          <TableOrViewOption
            on:click={() => toggleSelection(tableOrView)}
            {selected}
            {tableOrView}
          />
        {/each}
      </div>
    {/each}
  </Layout>
</ModalContent>

<style>
  .datasource {
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
    grid-gap: var(--spacing-s);
    max-width: 100%;
    min-width: 0;
  }

  .datasource:last-child {
    padding-bottom: 0;
  }

  .header {
    display: flex;
    align-items: center;
    padding-bottom: var(--spacing-m);
  }

  .header :global(svg) {
    flex-shrink: 0;
  }

  .header h2 {
    padding-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    margin-left: 10px;
  }
</style>
