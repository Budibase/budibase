<script>
  import { Select, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { Explanation } from './Explanation'
  import { debounce } from "lodash"
  import { params } from "@roxi/routify"
  import { Constants } from "@budibase/frontend-core"
  import { FIELDS } from 'constants/backend'

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let explanation

  let contextTooltipAnchor = null
  let currentOption = null
  let contextTooltipVisible = false

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
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
    currentOption = option;
    contextTooltipVisible = true;
    }
  }, 200);

  const onOptionMouseenter = (e, option) => {
    updateTooltip(e, option);
  }

  const onOptionMouseleave = (e) => {
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

{#if explanation}
  <ContextTooltip
    visible={contextTooltipVisible}
    anchor={contextTooltipAnchor}
    offset={20}
  >
    <Explanation
      tableHref={`/builder/app/${$params.application}/data/table/${datasource?.tableId}`}
      schema={schema[currentOption]}
      columnIcon={getOptionIcon(currentOption)}
      columnName={currentOption}
      columnType={getOptionIconTooltip(currentOption)}
      {explanation}
    />
  </ContextTooltip>
{/if}
