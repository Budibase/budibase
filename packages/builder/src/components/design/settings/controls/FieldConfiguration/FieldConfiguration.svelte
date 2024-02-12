<script>
  import { Toggle } from "@budibase/bbui"
  import { cloneDeep, isEqual } from "lodash/fp"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { currentAsset, store, selectedScreen } from "builderStore"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FieldSetting from "./FieldSetting.svelte"
  import { convertOldFieldFormat, getComponentForField } from "./utils"
  import { generateIncrementedName } from "helpers/helpers"

  export let componentInstance
  export let bindings
  export let value
  export let customSchema = false

  const dispatch = createEventDispatcher()

  let sanitisedFields
  let fieldList
  let schema
  let cachedValue
  let options
  let sanitisedValue
  let unconfigured
  let componentBindings = []
  let selectAll = true

  $: resolvedBindings =
    bindings || getBindableProperties($selectedScreen, componentInstance._id)
  $: actionType = componentInstance.actionType
  $: if (actionType) {
    componentBindings = getComponentBindableProperties(
      $selectedScreen,
      componentInstance._id
    )
  }
  $: datasource =
    componentInstance.dataSource ||
    getDatasourceForProvider($currentAsset, componentInstance)
  $: resourceId = datasource?.resourceId || datasource?.tableId
  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }
  $: updateState(cachedValue, resourceId)

  const updateState = value => {
    // Handle custom types
    if (customSchema) {
      fieldList = value || []
      return
    }

    schema = getSchema($currentAsset, datasource)
    options = Object.keys(schema || {})
    sanitisedValue = getValidColumns(convertOldFieldFormat(value), options)
    updateSanitsedFields(sanitisedValue)
    unconfigured = buildUnconfiguredOptions(schema, sanitisedFields)
    fieldList = [...sanitisedFields, ...unconfigured]
      .map(buildPseudoInstance)
      .filter(x => x != null)
  }

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

  const getValidColumns = (columns, options, customSchema) => {
    if (!Array.isArray(columns) || !columns.length) {
      return []
    }

    // Allow any columns for custom schema
    if (customSchema) {
      return columns
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
    const parentFieldIdx = parentFieldsUpdated.findIndex(pSetting => {
      return pSetting._id === updatedField?._id
    })

    // Add this field if not encountered before. Otherwise, update it.
    if (parentFieldIdx === -1) {
      parentFieldsUpdated.push(updatedField)
    } else {
      parentFieldsUpdated[parentFieldIdx] = updatedField
    }

    dispatch(
      "change",
      getValidColumns(parentFieldsUpdated, options, customSchema)
    )
  }

  const listUpdated = columns => {
    const parsedColumns = getValidColumns(columns, options, customSchema)
    dispatch("change", parsedColumns)
  }

  const createInstance = (name, type) => {
    // Generate the next available field name if required
    if (!name) {
      name = generateIncrementedName({
        items: fieldList,
        extractName: field => field.field,
        prefix: "Field",
      })
    }

    // Default to text field
    if (!type) {
      type = "@budibase/standard-components/stringfield"
    }

    // Make new instance
    return {
      ...store.actions.components.createInstance(type, {
        _instanceName: name,
        field: name,
        label: name,
        placeholder: name,
      }),
      active: true,
    }
  }

  const addField = () => {
    dispatch("change", [...fieldList, createInstance()])
  }

  const removeField = id => {
    dispatch(
      "change",
      fieldList.filter(field => field._id !== id)
    )
  }

  const changeFieldType = (id, newType) => {
    const idx = fieldList.findIndex(field => field._id === id)
    if (idx === -1) {
      return
    }
    const existingField = fieldList[idx]
    let newField = createInstance(existingField.field, newType)

    // Reuse existing ID to prevent closing the component popover
    newField._id = id

    dispatch("change", fieldList.toSpliced(idx, 1, newField))
  }
</script>

<div class="field-configuration">
  <div class="toggle-all">
    <span>Fields</span>
    {#if !customSchema}
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
        disabled={!fieldList?.length}
      />
    {/if}
  </div>
  <DraggableList
    on:change={e => listUpdated(e.detail)}
    on:itemChange={processItemUpdate}
    on:add={addField}
    items={fieldList}
    listItemKey={"_id"}
    listType={FieldSetting}
    listTypeProps={{
      componentBindings,
      bindings: resolvedBindings,
      customSchema,
      removeField,
      changeFieldType,
    }}
    addButtonVisible={customSchema}
    addButtonText="Add field"
    addButtonDisabled={false}
  />
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
    margin-bottom: var(--spacing-s);
  }
  .toggle-all :global(.spectrum-Switch) {
    margin-right: 0;
    padding-right: calc(var(--spacing-s) - 1px);
    min-height: unset;
  }
  .toggle-all :global(.spectrum-Switch .spectrum-Switch-switch) {
    margin: 0;
  }
  .toggle-all span {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
</style>
