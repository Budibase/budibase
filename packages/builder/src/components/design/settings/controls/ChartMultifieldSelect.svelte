<script>
  import { Multiselect } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let fieldValidator

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema

  const getOptions = (schema, fieldValidator) => {
    if (fieldValidator != null) {
      return Object.keys(schema || {})
    }
  }

  $: options = Object.keys(schema || {}).filter(key => {
    return (
      schema[key].type !== "json" &&
      schema[key].type !== "array" &&
      schema[key].type !== "attachment" &&
      schema[key].type !== "barcodeqr" &&
      schema[key].type !== "link" &&
      schema[key].type !== "bb_reference"
    );
  });
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
