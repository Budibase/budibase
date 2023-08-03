<script>
  import { cloneDeep } from "lodash/fp"
  import { generate } from "shortid"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import SettingsList from "../SettingsList.svelte"
  import { createEventDispatcher } from "svelte"
  import { store, selectedScreen } from "builderStore"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"

  import EditFieldPopover from "./EditFieldPopover.svelte"

  export let componentInstance
  export let value

  const dispatch = createEventDispatcher()

  // Dean - From the inner form block - make a util
  const FieldTypeToComponentMap = {
    string: "stringfield",
    number: "numberfield",
    bigint: "bigintfield",
    options: "optionsfield",
    array: "multifieldselect",
    boolean: "booleanfield",
    longform: "longformfield",
    datetime: "datetimefield",
    attachment: "attachmentfield",
    link: "relationshipfield",
    json: "jsonfield",
    barcodeqr: "codescanner",
  }

  // Dean - From the inner form block - make a util
  const getComponentForField = field => {
    if (!field || !schema?.[field]) {
      return null
    }
    const type = schema[field].type
    return FieldTypeToComponentMap[type]
  }

  let fieldConfigList

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchema($currentAsset, datasource)
  $: options = Object.keys(schema || {})
  $: sanitisedValue = getValidColumns(convertOldFieldFormat(value), options)
  $: updateBoundValue(sanitisedValue)

  $: fieldConfigList.forEach(column => {
    if (!column.id) {
      column.id = generate()
    }
  })

  $: bindings = getBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: console.log("bindings ", bindings)

  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    $store.selectedComponentId
  )
  $: console.log("componentBindings ", componentBindings)

  // Builds unused ones only
  const buildListOptions = (schema, selected) => {
    let schemaClone = cloneDeep(schema)
    selected.forEach(val => {
      delete schemaClone[val.name]
    })

    return Object.keys(schemaClone)
      .filter(key => !schemaClone[key].autocolumn)
      .map(key => {
        const col = schemaClone[key]
        return {
          name: key,
          displayName: key,
          id: generate(),
          active: typeof col.active != "boolean" ? !value : col.active,
        }
      })
  }

  /*
    SUPPORT 
      - ["FIELD1", "FIELD2"...]
          "fields": [ "First Name", "Last Name" ]

      - [{name: "FIELD1", displayName: "FIELD1"}, ... only the currentlyadded fields]
      * [{name: "FIELD1", displayName: "FIELD1", active: true|false}, all currently available fields] 
  */

  $: unconfigured = buildListOptions(schema, fieldConfigList)

  const convertOldFieldFormat = fields => {
    let formFields
    if (typeof fields?.[0] === "string") {
      formFields = fields.map(field => ({
        name: field,
        displayName: field,
        active: true,
      }))
    } else {
      formFields = fields
    }
    return (formFields || []).map(field => {
      return {
        ...field,
        active: typeof field?.active != "boolean" ? true : field?.active,
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

  const updateBoundValue = value => {
    fieldConfigList = cloneDeep(value)
  }

  const getValidColumns = (columns, options) => {
    if (!Array.isArray(columns) || !columns.length) {
      return []
    }
    // We need to account for legacy configs which would just be an array
    // of strings
    if (typeof columns[0] === "string") {
      columns = columns.map(col => ({
        name: col,
        displayName: col,
      }))
    }
    return columns.filter(column => {
      return options.includes(column.name)
    })
  }

  let listOptions
  $: if (fieldConfigList) {
    listOptions = [...fieldConfigList, ...unconfigured].map(column => {
      const type = getComponentForField(column.name)
      const _component = `@budibase/standard-components/${type}`

      return { ...column, _component } //only necessary if it doesnt exist
    })
    console.log(listOptions)
  }

  const listUpdated = e => {
    const parsedColumns = getValidColumns(e.detail, options)
    dispatch("change", parsedColumns)
  }
</script>

<div class="field-configuration">
  <SettingsList
    value={listOptions}
    on:change={listUpdated}
    rightButton={EditFieldPopover}
    rightProps={{ componentBindings, bindings, parent: componentInstance }}
  />
</div>

<style>
  .field-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
