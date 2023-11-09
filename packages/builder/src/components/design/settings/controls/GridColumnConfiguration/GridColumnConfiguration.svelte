<script>
  import { cloneDeep, isEqual } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import FieldSetting from "./FieldSetting.svelte"
  import PrimaryColumnFieldSetting from "./PrimaryColumnFieldSetting.svelte"
  import getColumnsStore from "./getColumnsStore.js"

  export let value
  export let componentInstance
  let primaryDisplayColumnAnchor

  const dispatch = createEventDispatcher()

  const handleChange = (newValues) => {
    dispatch("change", newValues)
  }

  $: columnsStore = getColumnsStore(value, componentInstance, handleChange);

  const processItemUpdate = e => {
    columnsStore.update([e.detail]);
  }

  const listUpdated = e => {
    columnsStore.update(e.detail);
  }
</script>


{#if $columnsStore.primary}
  <div class="sticky-item">
    <div bind:this={primaryDisplayColumnAnchor} class="sticky-item-inner">
      <div class="right-content">
        <PrimaryColumnFieldSetting
          anchor={primaryDisplayColumnAnchor}
          item={$columnsStore.primary}
          on:change={processItemUpdate}
        />
      </div>
    </div>
  </div>
{/if}
<DraggableList
  on:change={listUpdated}
  on:itemChange={processItemUpdate}
  items={$columnsStore.sortable}
  listItemKey={"_id"}
  listType={FieldSetting}
/>

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
