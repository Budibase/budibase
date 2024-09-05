<script>
  import { FeatureFlag } from "@budibase/types"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen, componentStore } from "stores/builder"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FieldSetting from "./FieldSetting.svelte"
  import PrimaryColumnFieldSetting from "./PrimaryColumnFieldSetting.svelte"
  import getColumns from "./getColumns.js"
  import { isEnabled } from "helpers/featureFlags"

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

    // Don't show ID and rev in tables
    if (schema) {
      delete schema._id
      delete schema._rev
    }

    return schema
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

  const addCustomColumn = () => {
    const generateName = () => {
      const defaultName = "Custom column"
      const nameRegex = new RegExp(`^${defaultName}( (?<count>\\d+))?$`)
      const customColumnCount = columns.sortable
        .filter(f => f.custom && nameRegex.test(f.label))
        .reduce((acc, c) => {
          const columnNumber = +(nameRegex.exec(c.label).groups["count"] || 1)
          if (columnNumber >= acc) {
            return columnNumber + 1
          }
          return acc
        }, 1)
      return (
        defaultName + (customColumnCount > 1 ? ` ${customColumnCount}` : "")
      )
    }

    const name = generateName()

    columns.add({
      field: `custom_${Date.now()}`,
      label: name,
      active: true,
      columnType: "string",
      custom: true,
    })
  }
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
<DraggableList
  on:change={e => columns.updateSortable(e.detail)}
  on:itemChange={e => columns.update(e.detail)}
  on:delete={e => columns.remove(e.detail)}
  items={columns.sortable}
  listItemKey={"_id"}
  listType={FieldSetting}
  listTypeProps={{
    bindings,
  }}
/>

{#if isEnabled(FeatureFlag.ENRICHED_RELATIONSHIPS)}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="list-footer" on:click={addCustomColumn}>
    <div class="add-button">Add custom column</div>
  </div>
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
    margin-bottom: var(--spacing-m);
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

  .list-footer {
    margin-top: var(--spacing-m);
    width: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    justify-content: center;
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    cursor: pointer;
  }
  .list-footer:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }

  .add-button {
    margin: var(--spacing-s);
  }
</style>
