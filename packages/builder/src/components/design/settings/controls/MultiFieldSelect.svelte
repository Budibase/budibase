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
  import { MultiFieldSelectionState } from "./multiFieldSelectState"

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let explanation

  let contextTooltipAnchor = null
  let currentOption = null
  let contextTooltipVisible = false

  const dispatch = createEventDispatcher()
  const selectionState = new MultiFieldSelectionState()
  let boundValue = []
  $: datasource = getDatasourceForProvider($selectedScreen, componentInstance)
  $: schema = getSchemaForDatasource($selectedScreen, datasource).schema
  $: options = Object.keys(schema || {})
  $: selectionState.syncFromProps(value, options)
  $: boundValue = selectionState.getSelection()

  const setValue = event => {
    selectionState.applyUserSelection(event.detail, options)
    boundValue = selectionState.getSelection()
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
      tableHref={`/builder/workspace/${$params.application}/data/table/${datasource?.tableId}`}
      schema={schema[currentOption]}
      name={currentOption}
      {explanation}
      componentName={componentInstance._component}
    />
  </ContextTooltip>
{/if}
