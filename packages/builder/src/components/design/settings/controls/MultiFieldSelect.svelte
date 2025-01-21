<script>
  import { Multiselect, ContextTooltip } from "@budibase/bbui"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "@/dataBinding"
  import { selectedScreen } from "@/stores/builder"
  import { createEventDispatcher } from "svelte"
  import { Explanation } from "./Explanation"
  import { params } from "@roxi/routify"
  import { debounce } from "lodash"

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

  const updateTooltip = debounce((e, option) => {
    if (option == null) {
      contextTooltipVisible = false
    } else {
      contextTooltipAnchor = e?.target
      currentOption = option
      contextTooltipVisible = true
    }
  }, 200)

  const onOptionMouseenter = (e, option) => {
    updateTooltip(e, option)
  }

  const onOptionMouseleave = e => {
    updateTooltip(e, null)
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
      tableHref={`/builder/app/${$params.application}/data/table/${datasource?.tableId}`}
      schema={schema[currentOption]}
      name={currentOption}
      {explanation}
      componentName={componentInstance._component}
    />
  </ContextTooltip>
{/if}
