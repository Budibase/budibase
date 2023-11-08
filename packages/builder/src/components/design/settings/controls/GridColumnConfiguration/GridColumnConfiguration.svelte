<script>
  import { cloneDeep, isEqual } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import DraggableList from "./DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import FieldSetting from "./FieldSetting.svelte"

  export let componentInstance
  export let value

  const dispatch = createEventDispatcher()
  let sanitisedFields
  let fieldList
  let schema
  let cachedValue
  let options
  let sanitisedValue
  let unconfigured
  let primaryDisplayColumn

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: resourceId = datasource?.resourceId || datasource?.tableId
  let previousResourceId = null

  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }

  const updateState = value => {
    schema = getSchema($currentAsset, datasource)
    options = Object.keys(schema || {})
    sanitisedValue = getValidColumns(value, options)
    updateSanitsedFields(sanitisedValue)
    unconfigured = buildUnconfiguredOptions(schema, sanitisedFields)
    fieldList = [...sanitisedFields, ...unconfigured]
      .map(buildPseudoInstance)
      .filter(x => x != null)
    const primaryDisplayColumnName = getPrimaryDisplayColumnName(
      $currentAsset,
      datasource
    )
    primaryDisplayColumn = fieldList.find(
      field => field.field === primaryDisplayColumnName
    )

    if (resourceId !== previousResourceId) {
      if (previousResourceId !== null) {
        fieldList = fieldList.map(fl => ({ ...fl, active: true }))
        dispatch("change", fieldList)
      }

      previousResourceId = resourceId
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

    return Object.keys(schemaClone).map(key => {
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

  const getPrimaryDisplayColumnName = (asset, datasource) => {
    return getSchemaForDatasource(asset, datasource)?.table?.primaryDisplay
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

    instance._component = "@budibase/standard-components/labelfield"

    const pseudoComponentInstance = store.actions.components.createInstance(
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

  const listUpdated = e => {
    const parsedColumns = getValidColumns(e.detail, options)
    dispatch("change", parsedColumns)
  }
</script>

<DraggableList
  stickyItem={primaryDisplayColumn}
  on:change={listUpdated}
  on:itemChange={processItemUpdate}
  items={fieldList}
  listItemKey={"_id"}
  listType={FieldSetting}
/>
