<script>
  import { Select, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { FieldContext, getColumnInfoMessagesAndSupport } from './FieldContext'
  import { debounce } from "lodash"
  import { goto, params } from "@roxi/routify"
  import { Constants } from "@budibase/frontend-core"
  import { FIELDS } from 'constants/backend'

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let columnInfo

  let contextTooltipAnchor = null
  let currentOption = null
  let previousOption = null
  let contextTooltipVisible = false

  const getFieldSupport = (schema, columnInfo) => {
    if (columnInfo == null) {
      return {}
    }

    const fieldSupport = {}
    Object.entries(schema || {}).forEach(([key, value]) => {
      fieldSupport[key] = getColumnInfoMessagesAndSupport(value)
    })

    return fieldSupport
  }

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
  $: fieldSupport = getFieldSupport(schema, columnInfo);
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
  const getOptionIcon = optionKey => {
    const option = schema[optionKey]
    if (!option) return ""

    if (option.autocolumn) {
      return "MagicWand"
    }
    const { type, subtype } = option

    const result =
      typeof Constants.TypeIconMap[type] === "object" && subtype
        ? Constants.TypeIconMap[type][subtype]
        : Constants.TypeIconMap[type]

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

</script>

<Select
  {placeholder}
  value={boundValue}
  on:change={onChange} 
  {options}
  {onOptionMouseenter}
  {onOptionMouseleave}
/>

{#if columnInfo}
  <ContextTooltip
    visible={contextTooltipVisible}
    anchor={contextTooltipAnchor}
    offset={20}
  >
    <FieldContext
      explanationModal
      tableHref={`/builder/app/${$params.application}/data/table/${datasource?.tableId}`}
      schema={schema[currentOption]}
      support={fieldSupport[currentOption]}
      columnIcon={getOptionIcon(currentOption)}
      columnName={currentOption}
      columnType={getOptionIconTooltip(currentOption)}
    />
    <FieldContext
      slot="previous"
      schema={schema[previousOption]}
      support={fieldSupport[previousOption]}
      columnIcon={getOptionIcon(previousOption)}
      columnName={previousOption}
      columnType={getOptionIconTooltip(previousOption)}
    />
  </ContextTooltip>
{/if}
