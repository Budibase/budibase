<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen,
    componentStore,
  } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { Explanation } from './Explanation'
  import { FIELDS } from 'constants/backend'
  import { goto, params } from "@roxi/routify"
  import { debounce } from "lodash"
  import { Constants } from "@budibase/frontend-core"

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let explanation

  let contextTooltipAnchor = null
  let currentOption = null
  let previousOption = null
  let contextTooltipVisible = false

  $: componentDefinition = componentStore.getDefinition(
    componentInstance?._component
  )

  const dispatch = createEventDispatcher()
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
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
    } else if (type === "jsonarray") {
      // `jsonarray` isn't present in the above FIELDS constant

      return "JSON Array"
    }

    return ""
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
  {placeholder}
  value={boundValue}
  on:change={setValue}
  {options}
  align="right"
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
      showDetails
      tableHref={`/builder/app/${$params.application}/data/table/${datasource?.tableId}`}
      schema={schema[currentOption]}
      columnIcon={getOptionIcon(currentOption)}
      columnName={currentOption}
      columnType={getOptionIconTooltip(currentOption)}
      {explanation}
    />
    <Explanation
      slot="previous"
      schema={schema[previousOption]}
      columnIcon={getOptionIcon(previousOption)}
      columnName={previousOption}
      columnType={getOptionIconTooltip(previousOption)}
      {explanation}
    />
  </ContextTooltip>
{/if}
