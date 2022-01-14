<script>
  import { Multiselect } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import { createEventDispatcher } from "svelte"
  import { getTableFields } from "helpers/searchFields"

  export let componentInstance = {}
  export let value = ""
  export let placeholder

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, datasource).schema
  $: options = getOptions(datasource, schema || {})
  $: boundValue = getSelectedOption(value, options)

  function getOptions(ds, dsSchema) {
    let base = Object.keys(dsSchema)
    if (!ds?.tableId) {
      return base
    }
    const currentTable = $tables.list.find(table => table._id === ds.tableId)
    if (currentTable && currentTable.sql) {
      for (let column of Object.values(currentTable.schema)) {
        if (column.type === "link") {
          base = base.concat(getTableFields(column).map(field => field.name))
        }
      }
    }
    return base
  }

  function getSelectedOption(selectedOptions, allOptions) {
    // Fix the hardcoded default string value
    if (!Array.isArray(selectedOptions)) {
      selectedOptions = []
    }
    return selectedOptions.filter(val => allOptions.indexOf(val) !== -1)
  }

  const setValue = value => {
    boundValue = getSelectedOption(value.detail, options)
    dispatch("change", boundValue)
  }
</script>

<Multiselect {placeholder} value={boundValue} on:change={setValue} {options} />
