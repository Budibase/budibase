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

    return option?.type;
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

  const getSupportLevel = (optionKey) => {
    const level = fieldSupport[optionKey]?.level;

    if (level === validatorConstants.unsupported) {
      return {
        class: "supportLevelUnsupported",
        icon: "Alert",
        iconTooltip: fieldSupport[optionKey]?.message,
        text: "Unsupported"
      }
    }

    if (level === validatorConstants.partialSupport) {
      return {
        class: "supportLevelPartialSupport",
        icon: "AlertCheck",
        iconTooltip: fieldSupport[optionKey]?.message,
        text: "Partial Support"
      }
    }

    if (level === validatorConstants.supported) {
      return {
        class: "supportLevelSupported",
        icon: "CheckmarkCircle",
        iconTooltip: fieldSupport[optionKey]?.message,
        text: "Supported"
      }
    }

    return {
      class: "supportLevelUnsupported",
      icon: "Alert",
      iconTooltip: "",
      text: "Unsupported"
    }
  }

  $: currentOptionSupport = getSupportLevel(currentOption)
  $: previousOptionSupport = getSupportLevel(previousOption)

  const onOptionMouseenter = (e, option, idx) => {
    console.log(option)
    contextTooltipId += 1;
    const invokedContextTooltipId = contextTooltipId

    setTimeout(() => {
      if (contextTooltipId === invokedContextTooltipId) {
        contextTooltipAnchor = e.target;
        previousOption = currentOption;
        currentOption = option;
        contextTooltipVisible = true;
        currentOptionSupport = getSupportLevel(currentOption)
        previousOptionSupport = getSupportLevel(previousOption)
      }
    }, 200)
  }

  const onOptionMouseleave = (e, option) => {
    setTimeout(() => {
      if (option === currentOption) {
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
    class={`tooltipContents ${currentOptionSupport.class}`}
  >
    <div class={`supportLevel ${currentOptionSupport.class}`}>
      <Icon tooltip={currentOptionSupport.iconTooltip} name={currentOptionSupport.icon} />
      <p>{currentOptionSupport.text}</p>
    </div>
    <div class="contextTooltipContent">
      <div class="contextTooltipHeader">
        <Icon name={getOptionIcon(currentOption)} />
        <span>{currentOption}</span>
      </div>

      {#if fieldSupport[currentOption]?.errors?.length > 0}
        {#each (fieldSupport[currentOption].errors) as datum}
          <p>{datum}</p>
        {/each}
      {:else if fieldSupport[currentOption]?.warnings?.length > 0}
        {#each (fieldSupport[currentOption].warnings) as datum}
          <p>{datum}</p>
        {/each}
      {/if}
    </div>
  </div>
  <div slot="previous"
    class={`tooltipContents ${previousOptionSupport.class}`}
  >
    <div class={`supportLevel ${previousOptionSupport.class}`}>
      <Icon tooltip={previousOptionSupport.iconTooltip} name={previousOptionSupport.icon} />
      <p>{previousOptionSupport.text}</p>
    </div>
    <div class="contextTooltipContent">
      <div class="contextTooltipHeader">
        <Icon name={getOptionIcon(previousOption)} />
        <span>{previousOption}</span>
      </div>

      {#if fieldSupport[previousOption]?.errors?.length > 0}
        {#each (fieldSupport[previousOption].errors) as datum}
          <p>{datum}</p>
        {/each}
      {:else if fieldSupport[previousOption]?.warnings?.length > 0}
        {#each (fieldSupport[previousOption].warnings) as datum}
          <p>{datum}</p>
        {/each}
      {/if}
    </div>
  </div>
</ContextTooltip>

<style>
  .tooltipContents {
    max-width: 400px;
    background-color: var(--spectrum-global-color-gray-200);
    display: block;
    padding: 0 0 12px 0 ;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .tooltipContents.supportLevelUnsupported {
    background-color: var(--red);
    color: var(--ink)
  }

  .tooltipContents.supportLevelPartialSupport {
    background-color: var(--yellow);
    color: var(--ink)
  }

  .tooltipContents.supportLevelSupported {
    background-color: var(--green);
    color: var(--ink)
  }

  .contextTooltipHeader {
    display: flex;
    align-items: center;
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

  .contextTooltipContent {
    padding: 0px 12px;
  }

  .contextTooltipHeader :global(svg) {
    color: var(--ink);
    margin-right: 5px;
  }

  .contextTooltipHeader :global(span) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .supportLevel {
    display: flex;
    align-items: center;
    height: var(--spectrum-alias-item-height-m);
    padding: 0px var(--spectrum-alias-item-padding-m);
    margin-bottom: 12px;
  }
  .supportLevel :global(svg) {
    margin-right: 5px;
  }

  .supportLevel.supportLevelUnsupported {
    background-color: var(--red-light)
  }

  .supportLevel.supportLevelPartialSupport {
    background-color: var(--yellow-light)
  }

  .supportLevel.supportLevelSupported {
    background-color: var(--green-light)
  }
</style>
