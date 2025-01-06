<script>
  import { Multiselect } from "@budibase/bbui"
  import { search } from "@budibase/frontend-core"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import { selectedScreen, tables } from "@/stores/builder"
  import { createEventDispatcher } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let placeholder

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
  $: options = getOptions(datasource, schema || {})
  $: boundValue = getSelectedOption(value, options)

  function getOptions(ds, dsSchema) {
    let base = Object.values(dsSchema)
    if (!ds?.tableId) {
      return base.map(field => field.name)
    }
    return search
      .getFields($tables.list, base, { allowLinks: true })
      .map(field => field.name)
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
