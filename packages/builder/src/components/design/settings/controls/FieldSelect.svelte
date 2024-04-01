<script>
  import { Select } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { validators, supported, partialSupport, unsupported } from "../fieldValidator";

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let fieldValidator

  $: {
    console.log(fieldValidator);
  }

  const getFieldSupport = (schema, fieldValidator) => {
    if (fieldValidator == null) {
      return {}
    }

    const validator = validators[fieldValidator];

    const fieldSupport = {}
    Object.entries(schema || {}).forEach(([key, value]) => {
      fieldSupport[key] = validator(value)
    })

    return fieldSupport
  }

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
  $: fieldSupport = getFieldSupport(schema, fieldValidator);
  $: options = Object.keys(schema || {})
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

  const getOptionIcon = option => {
    const support = fieldSupport[option]?.support;

    if (support == null) return null;
    if (support === supported) return null

    if (support === partialSupport) return "Warning"
    if (support === unsupported) return "Error"
  }

  const getOptionIconTooltip = option => {
  }

  const isOptionEnabled = option => {
    const support = fieldSupport[option]?.support;

    if (support == null) return true
    if (support == unsupported) return false

    return true
  }
</script>

<Select
  {isOptionEnabled}
  {getOptionIcon}
  {getOptionIconTooltip}
  {placeholder} value={boundValue} on:change={onChange} {options} />
