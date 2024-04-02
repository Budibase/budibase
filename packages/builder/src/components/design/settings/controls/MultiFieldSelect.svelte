<script>
  import { Multiselect } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { validators, supported, partialSupport, unsupported } from "../fieldValidator";

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let fieldValidator

  const TypeIconMap = {
    text: "Text",
    options: "Dropdown",
    datetime: "Date",
    barcodeqr: "Camera",
    longform: "TextAlignLeft",
    array: "Dropdown",
    number: "123",
    boolean: "Boolean",
    attachment: "AppleFiles",
    link: "DataCorrelated",
    formula: "Calculator",
    json: "Brackets",
    bigint: "TagBold",
    bb_reference: {
      user: "User",
      users: "UserGroup",
    },
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
  $: options = Object.keys(schema || {})
  $: fieldSupport = getFieldSupport(schema, fieldValidator);
  $: boundValue = getValidOptions(value, options)

  $: {
    console.log(schema)
  }

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

  const foo = () => {
    const support = fieldSupport[option]?.support;

    if (support == null) return null;
    if (support === supported) return null

    if (support === partialSupport) return "AlertCircleFilled"
    if (support === unsupported) return "AlertCircleFilled"
  }

  const getOptionIcon = optionKey => {
    const option = schema[optionKey]
    if (option.autocolumn) {
      return "MagicWand"
    }
    const { type, subtype } = option

    const result =
      typeof TypeIconMap[type] === "object" && subtype
        ? TypeIconMap[type][subtype]
        : TypeIconMap[type]

    return result || "Text"
  }

  const getOptionIconTooltip = optionKey => {
    const option = schema[optionKey]

    return option.type;
  }

  const getOptionTooltip = optionKey => {
    const support = fieldSupport[optionKey]?.support;
    const message = fieldSupport[optionKey]?.message;

    if (support === unsupported) return message

    return null
  }

  const isOptionEnabled = optionKey => {
    // Remain enabled if already selected, so it can be deselected
    if (value?.includes(optionKey)) return true
    const support = fieldSupport[optionKey]?.support;

    if (support == null) return true
    if (support === unsupported) return false

    return true
  }
</script>

<Multiselect
  iconPosition="right"
  {isOptionEnabled}
  {getOptionIcon}
  {getOptionIconTooltip}
  {getOptionTooltip}
  {placeholder}
  value={boundValue}
  on:change={setValue}
  {options}
  align="right"
/>
