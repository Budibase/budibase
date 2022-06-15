<script>
  import { Multiselect } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"
  import { createEventDispatcher } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let placeholder

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource($currentAsset, datasource).schema
  $: options = Object.keys(schema || {})
  $: boundValue = getValidOptions(value, options)

  const getValidOptions = (selectedOptions, allOptions) => {
    // Fix the hardcoded default string value
    if (!Array.isArray(selectedOptions)) {
      selectedOptions = []
    }
    return selectedOptions.filter(val => allOptions.indexOf(val) !== -1)
  }

  const setValue = value => {
    boundValue = getValidOptions(value.detail, options)
    dispatch("change", boundValue)
  }
</script>

<Multiselect {placeholder} value={boundValue} on:change={setValue} {options} />
