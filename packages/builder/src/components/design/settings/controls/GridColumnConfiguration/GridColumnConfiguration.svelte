<script>
  import { enrichSchemaWithRelColumns } from "@budibase/frontend-core"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FieldSetting from "./FieldSetting.svelte"
  import PrimaryColumnFieldSetting from "./PrimaryColumnFieldSetting.svelte"
  import getColumns from "./getColumns.js"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"

  export let value
  export let componentInstance
  export let bindings

  const dispatch = createEventDispatcher()
  let primaryDisplayColumnAnchor

  const handleChange = newValues => {
    dispatch("change", newValues)
  }

  const getSchema = (asset, datasource) => {
    const schema = getSchemaForDatasource(asset, datasource).schema

    if (!schema) {
      return
    }

    // Don't show ID and rev in tables
    delete schema._id
    delete schema._rev

    const result = enrichSchemaWithRelColumns(schema)
    return result
  }

  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: primaryDisplayColumnName = getSchemaForDatasource(
    $selectedScreen,
    datasource
  )?.table?.primaryDisplay
  $: schema = getSchema($selectedScreen, datasource)
  $: columns = getColumns({
    columns: value,
    schema,
    primaryDisplayColumnName,
    onChange: handleChange,
    createComponent: componentStore.createInstance,
  })
</script>

{#if columns.primary}
  <div class="sticky-item">
    <div bind:this={primaryDisplayColumnAnchor} class="sticky-item-inner">
      <div class="right-content">
        <PrimaryColumnFieldSetting
          anchor={primaryDisplayColumnAnchor}
          item={columns.primary}
          on:change={e => columns.update(e.detail)}
        />
      </div>
    </div>
  </div>
{/if}

{#if columns?.sortable?.length}
  <DraggableList
    on:change={e => columns.updateSortable(e.detail)}
    on:itemChange={e => columns.update(e.detail)}
    items={columns.sortable}
    listItemKey={"_id"}
    listType={FieldSetting}
    listTypeProps={{
      bindings,
    }}
  />
{:else}
  <InfoDisplay
    body={datasource?.type !== "custom"
      ? "No available columns"
      : "No available columns for JSON/CSV data sources"}
  />
{/if}

<style>
  .right-content {
    flex: 1;
    min-width: 0;
    margin-left: 17.5px;
  }
  .sticky-item {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
    border-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    margin-bottom: 10px;
  }
  .sticky-item-inner {
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    align-items: center;
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);
    box-sizing: border-box;
    border-radius: 4px;
    border-bottom: 0;
  }
</style>
