<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import { validators, constants as validatorConstants } from "../fieldValidator";

  export let componentInstance = {}
  export let value = ""
  export let placeholder
  export let fieldValidator

  let contextTooltipId = 0;
  let contextTooltipAnchor = null
  let contextTooltipOption = null
  let previousContextTooltipOption = null
  let contextTooltipVisible = false

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
    /*
    const support = fieldSupport[option]?.support;

    if (support == null) return null;
    if (support === supported) return null

    if (support === partialSupport) return "AlertCircleFilled"
    if (support === unsupported) return "AlertCircleFilled"
    */
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

    return message
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

  const onOptionMouseenter = (e, option, idx) => {
    contextTooltipId += 1;
    const invokedContextTooltipId = contextTooltipId

    setTimeout(() => {
      if (contextTooltipId === invokedContextTooltipId) {
        contextTooltipAnchor = e.target;
        previousContextTooltipOption = contextTooltipOption;
        contextTooltipOption = option;
        contextTooltipVisible = true;
      }
    }, 200)
  }

  const onOptionMouseleave = (e, option) => {
    setTimeout(() => {
      if (option === contextTooltipOption) {
        contextTooltipVisible = false;
      }
    }, 600)
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
  <div
    class="tooltipContents"
  >
    {#if contextTooltipOption}
      <div class="contextTooltipHeader">
        <Icon name={getOptionIcon(contextTooltipOption)} />
        <span>{contextTooltipOption}</span>
      </div>
      <p>{getOptionTooltip(contextTooltipOption)}</p>
    {/if}
  </div>
  <div slot="previous"
    class="tooltipContents"
  >
    {#if previousContextTooltipOption}
      <div class="contextTooltipHeader">
        <Icon name={getOptionIcon(previousContextTooltipOption)} />
        <span>{previousContextTooltipOption}</span>
      </div>
      <p>{getOptionTooltip(previousContextTooltipOption)}</p>
    {/if}
  </div>
</ContextTooltip>

<style>
  .tooltipContents {
    max-width: 200px;
    background-color: var(--spectrum-global-color-gray-200);
    display: inline-block;
    padding: 12px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .contextTooltipHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--spectrum-alias-item-height-m);
    padding: 0px var(--spectrum-alias-item-padding-m);
    border-width: var(--spectrum-actionbutton-border-size);
    border-radius: var(--spectrum-alias-border-radius-regular);
    border: 1px solid
      var(
        --spectrum-actionbutton-m-border-color,
        var(--spectrum-alias-border-color)
      );
  }

  .contextTooltipHeader :global(svg) {
    color: var(--background);
    margin-right: 5px;
  }

  .contextTooltipHeader :global(span) {
 white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  }
</style>
