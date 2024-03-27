<script>
  import { Select } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"

  export let componentInstance = {}
  export let value = ""
  export let placeholder

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
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
  $: boundValue = getValidValue(value, options)

  const getValidValue = (value, options) => {
    // Reset value if there aren't any options
    if (!Array.isArray(options)) {
      return null
    }

    // Reset value if the value isn't found in the options
    if (options.indexOf(value) === -1) {
      return null
    }

    return value
  }

  const onChange = value => {
    boundValue = getValidValue(value.detail, options)
    dispatch("change", boundValue)
  }

  $: {
    console.log(options, schema);
  }
</script>

<Select {placeholder} value={boundValue} on:change={onChange} {options} />
