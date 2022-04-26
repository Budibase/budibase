<script>
  import { Multiselect } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import { createEventDispatcher } from "svelte"
  import { getFields } from "helpers/searchFields"

  export let componentInstance = {}
  export let value = ""
  export let placeholder

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, datasource).schema
  $: options = getOptions(datasource, schema || {})
  $: boundValue = getSelectedOption(value, options)

  function getOptions(ds, dsSchema) {
    let base = Object.values(dsSchema)
    if (!ds?.tableId) {
      return base.map(field => field.name)
    }
    const currentTable = $tables.list.find(table => table._id === ds.tableId)
    return getFields(base, { allowLinks: currentTable?.sql }).map(
      field => field.name
    )
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
