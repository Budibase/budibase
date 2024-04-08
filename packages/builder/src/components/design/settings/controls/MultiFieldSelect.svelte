<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { validators, constants as validatorConstants } from "../fieldValidator";
  import ChartFieldContext from './FieldContext/Chart.svelte'
  import { FIELDS } from 'constants/backend'
  import { goto, params } from "@roxi/routify"
  import { debounce } from "lodash"

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let fieldValidator

  let contextTooltipAnchor = null
  let currentOption = null
  let previousOption = null
  let contextTooltipVisible = false
  let currentOptionSupport = {}
  let previousOptionSupport = {}


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
  $: console.log(datasource)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
  $: options = Object.keys(schema || {})
  $: fieldSupport = getFieldSupport(schema, fieldValidator);
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

  const getOptionIcon = optionKey => {
    const option = schema[optionKey]
    if (!option) return ""

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

    const type = option?.type;
    const field = Object.values(FIELDS).find(f => f.type === type)

    if (field) {
      return field.name
    }

    return ""
  }

  const isOptionEnabled = optionKey => {
    return true;
    // Remain enabled if already selected, so it can be deselected
    if (value?.includes(optionKey)) return true
    const support = fieldSupport[optionKey]?.support;

    if (support == null) return true
    if (support === unsupported) return false

    return true
  }

  const updateTooltip = debounce((e, option) => {
    if (option == null) {
        contextTooltipVisible = false;
    } else {
    contextTooltipAnchor = e?.target;
    previousOption = currentOption;
    currentOption = option;
    contextTooltipVisible = true;
    }
  }, 200);

  const onOptionMouseenter = (e, option, idx) => {
    updateTooltip(e, option);
  }

  const onOptionMouseleave = (e, option) => {
    updateTooltip(e, null);
  }
</script>

<Multiselect
  iconPosition="right"
  {isOptionEnabled}
  {placeholder}
  value={boundValue}
  on:change={setValue}
  {options}
  align="right"
  {onOptionMouseenter}
  {onOptionMouseleave}
/>
<ContextTooltip
  visible={contextTooltipVisible}
  anchor={contextTooltipAnchor}
  offset={20}
>
  <ChartFieldContext
    explanationModal
    tableHref={`/builder/app/${$params.application}/data/table/${datasource?.tableId}`}
    schema={schema[currentOption]}
    support={fieldSupport[currentOption]}
    columnIcon={getOptionIcon(currentOption)}
    columnName={currentOption}
    columnType={getOptionIconTooltip(currentOption)}
  />
  <ChartFieldContext
    slot="previous"
    schema={schema[previousOption]}
    support={fieldSupport[previousOption]}
    columnIcon={getOptionIcon(previousOption)}
    columnName={previousOption}
    columnType={getOptionIconTooltip(previousOption)}
  />
</ContextTooltip>

<style>
</style>
