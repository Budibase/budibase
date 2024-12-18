<script>
  import { Toggle } from "@budibase/bbui"
  import { cloneDeep, isEqual } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
    getBindableProperties,
    getComponentBindableProperties,
  } from "@/dataBinding"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FieldSetting from "./FieldSetting.svelte"
  import { convertOldFieldFormat, getComponentForField } from "./utils"

  export let componentInstance
  export let bindings
  export let value

  const dispatch = createEventDispatcher()

  let sanitisedFields
  let fieldList
  let schema
  let cachedValue
  let options
  let sanitisedValue
  let unconfigured

  let selectAll = true

  $: resolvedBindings =
    bindings || getBindableProperties($selectedScreen, componentInstance._id)

  $: actionType = componentInstance.actionType
  let componentBindings = []

  $: if (actionType) {
    componentBindings = getComponentBindableProperties(
      $selectedScreen,
      componentInstance._id
    )
  }

  $: datasource =
    componentInstance.dataSource ||
    getDatasourceForProvider($selectedScreen, componentInstance)

  $: resourceId = datasource?.resourceId || datasource?.tableId

  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }

  const updateState = value => {
    schema = getSchema($selectedScreen, datasource)
    options = Object.keys(schema || {})
    sanitisedValue = getValidColumns(convertOldFieldFormat(value), options)
    updateSanitsedFields(sanitisedValue)
    unconfigured = buildUnconfiguredOptions(schema, sanitisedFields)
    fieldList = [...sanitisedFields, ...unconfigured]
      .map(buildPseudoInstance)
      .filter(x => x != null)
  }

  $: updateState(cachedValue, resourceId)

  // Builds unused ones only
  const buildUnconfiguredOptions = (schema, selected) => {
    if (!schema) {
      return []
    }
    let schemaClone = cloneDeep(schema)
    selected.forEach(val => {
      delete schemaClone[val.field]
    })

    return Object.keys(schemaClone)
      .filter(key => !schemaClone[key].autocolumn)
      .map(key => {
        const col = schemaClone[key]
        let toggleOn = !value
        return {
          field: key,
          active: typeof col.active != "boolean" ? toggleOn : col.active,
        }
      })
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

  const updateSanitsedFields = value => {
    sanitisedFields = cloneDeep(value)
  }

  const getValidColumns = (columns, options) => {
    if (!Array.isArray(columns) || !columns.length) {
      return []
    }

    return columns.filter(column => {
      return options.includes(column.field)
    })
  }

  const buildPseudoInstance = instance => {
    if (instance._component) {
      return instance
    }
    const type = getComponentForField(instance.field, schema)
    if (!type) {
      return null
    }
    instance._component = `@budibase/standard-components/${type}`

    const pseudoComponentInstance = componentStore.createInstance(
      instance._component,
      {
        _instanceName: instance.field,
        field: instance.field,
        label: instance.field,
        placeholder: instance.field,
      },
      {}
    )

    return { ...instance, ...pseudoComponentInstance }
  }

  const processItemUpdate = e => {
    const updatedField = e.detail
    const parentFieldsUpdated = fieldList ? cloneDeep(fieldList) : []

    let parentFieldIdx = parentFieldsUpdated.findIndex(pSetting => {
      return pSetting.field === updatedField?.field
    })

    if (parentFieldIdx == -1) {
      parentFieldsUpdated.push(updatedField)
    } else {
      parentFieldsUpdated[parentFieldIdx] = updatedField
    }

    dispatch("change", getValidColumns(parentFieldsUpdated, options))
  }

  const listUpdated = columns => {
    const parsedColumns = getValidColumns(columns, options)
    dispatch("change", parsedColumns)
  }
</script>

<div class="field-configuration">
  <div class="toggle-all">
    <span>Fields</span>
    <Toggle
      on:change={() => {
        let update = fieldList.map(field => ({
          ...field,
          active: selectAll,
        }))
        listUpdated(update)
      }}
      text=""
      bind:value={selectAll}
      thin
    />
  </div>
  {#if fieldList?.length}
    <DraggableList
      on:change={e => listUpdated(e.detail)}
      on:itemChange={processItemUpdate}
      items={fieldList}
      listItemKey={"_id"}
      listType={FieldSetting}
      listTypeProps={{
        componentBindings,
        bindings: resolvedBindings,
      }}
    />
  {/if}
</div>

<style>
  .field-configuration {
    padding-top: 8px;
  }
  .field-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }
  .toggle-all {
    display: flex;
    justify-content: space-between;
  }
  .toggle-all :global(.spectrum-Switch) {
    margin-right: 0px;
    padding-right: calc(var(--spacing-s) - 1px);
    min-height: unset;
  }
  .toggle-all :global(.spectrum-Switch .spectrum-Switch-switch) {
    margin-top: 0px;
  }
  .toggle-all span {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
</style>
