<script>
  import { Select, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen, selectedComponent, tables } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { Explanation } from "./Explanation"
  import { debounce } from "lodash"
  import { params } from "@roxi/routify"
  import { FieldType } from "@budibase/types"

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let explanation

  let contextTooltipAnchor = null
  let currentOption = null
  let contextTooltipVisible = false

  const dispatch = createEventDispatcher()
  $: schema = componentInstance?.schema
  $: options = Object.keys(schema || {}).filter(f =>
    [FieldType.LINK].includes(schema[f].type)
  )
  let boundValue = ""
  let relationshipField = ""
  $: {
    // const parts = value?.split(".0.")
    // boundValue = parts[0]
    // relationshipField = parts[1]
  }

  $: relationshipFieldOptions = Object.entries(
    schema?.[boundValue]?.columns || {}
  )
    .filter(([_, f]) => f.visible !== false)
    .map(([fieldName]) => fieldName)

  const onChange = value => {
    relationshipField = value.detail
    if (!boundValue || !relationshipField) {
      dispatch("change", null)
    } else {
      dispatch(
        "change",
        `{{ join (pluck ${boundValue} '${relationshipField}') ', ' }}`
      )
    }
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

<Select
  {placeholder}
  bind:value={boundValue}
  {options}
  {onOptionMouseenter}
  {onOptionMouseleave}
/>

<Select
  value={relationshipField}
  on:change={onChange}
  options={relationshipFieldOptions}
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
