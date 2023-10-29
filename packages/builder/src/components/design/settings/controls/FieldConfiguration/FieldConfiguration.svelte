<script>
  import { cloneDeep, isEqual } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import { store, selectedScreen } from "builderStore"
  import FieldSetting from "./FieldSetting.svelte"
  import PrimaryColumnFieldSetting from "./PrimaryColumnFieldSetting.svelte"
  import { convertOldFieldFormat, getComponentForField } from "./utils"

  export let componentInstance
  export let value
  export let includeAutoColumns = false;
  export let preventDraggingPrimaryColumn = false
  export let forcedComponent

  const dispatch = createEventDispatcher()
  let sanitisedFields
  let fieldList
  let schema
  let cachedValue
  let options
  let sanitisedValue
  let unconfigured
  let primaryDisplayColumn

  $: bindings = getBindableProperties($selectedScreen, componentInstance._id)
  $: actionType = componentInstance.actionType
  let componentBindings = []

  $: if (actionType) {
    componentBindings = getComponentBindableProperties(
      $selectedScreen,
      componentInstance._id
    )
  }

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: resourceId = datasource?.resourceId || datasource?.tableId
  let previousResourceId = null;

  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }

  const updateState = value => {
    schema = getSchema($currentAsset, datasource)
    primaryDisplayColumn = getPrimaryDisplayColumn($currentAsset, datasource)
    options = Object.keys(schema || {})
    sanitisedValue = getValidColumns(convertOldFieldFormat(value), options)
    updateSanitsedFields(sanitisedValue)
    unconfigured = buildUnconfiguredOptions(schema, sanitisedFields)
    fieldList = [...sanitisedFields, ...unconfigured]
      .map(buildPseudoInstance)
      .filter(x => x != null)

    if (resourceId !== previousResourceId) {
      if (previousResourceId !== null) {
        fieldList = fieldList.map(fl => ({...fl, active: true }));
        dispatch("change", fieldList);
      }

      previousResourceId = resourceId;
    }
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
      .filter(key => includeAutoColumns || !schemaClone[key].autocolumn)
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

  const getPrimaryDisplayColumn = (asset, datasource) => {
    return getSchemaForDatasource(asset, datasource)?.table?.primaryDisplay;
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
    const type = forcedComponent ?? getComponentForField(instance.field, schema)
    if (!type) {
      return null
    }
    instance._component = `@budibase/standard-components/${type}`

    const pseudoComponentInstance = store.actions.components.createInstance(
      instance._component,
      {
        _instanceName: instance.field,
        field: instance.field,
        label: instance.field,
        placeholder: instance.field
      },
      {}
    )

    return { ...instance, ...pseudoComponentInstance }
  }

  // maybe add a whitelist to draggablelist

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

  const listUpdated = e => {
    const parsedColumns = getValidColumns(e.detail, options)
    dispatch("change", parsedColumns)
  }
</script>

<div class="field-configuration">
  {#if preventDraggingPrimaryColumn}
    <div class="primaryColumn">
      <DraggableList
        noDrag
        hideHandle
        on:change={listUpdated}
        on:itemChange={processItemUpdate}
        items={fieldList}
        listItemKey={"_id"}
        listType={PrimaryColumnFieldSetting}
        listTypeProps={{
          componentBindings,
          bindings,
          hideToggle: true
        }}
        whitelist={[primaryDisplayColumn]}
      />
    </div>
  {/if}
  {#if fieldList?.length}
    <DraggableList
      on:change={listUpdated}
      on:itemChange={processItemUpdate}
      items={fieldList}
      listItemKey={"_id"}
      listType={FieldSetting}
      listTypeProps={{
        componentBindings,
        bindings,
      }}
        whitelist={preventDraggingPrimaryColumn ? fieldList.map(field => field.field).filter(field => field !== primaryDisplayColumn) : null}
    />
  {/if}
</div>

<style>
  .field-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }

  .primaryColumn {
    margin-bottom: 6px;
  }
</style>
