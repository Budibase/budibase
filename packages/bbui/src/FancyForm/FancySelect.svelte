<script lang="ts" generics="O extends Record<string, any> | string">
  import { createEventDispatcher } from "svelte"
  import Picker from "../Form/Core/Picker.svelte"
  import Icon from "../Icon/Icon.svelte"
  import StatusLight from "../StatusLight/StatusLight.svelte"
  import FancyField from "./FancyField.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"

  export let label: string | undefined
  export let value: string | undefined
  export let disabled: boolean = false
  export let error: string | null = null
  export let validate: ((_value: string | undefined) => string) | null = null
  export let options: O[] = []
  export let footer: string | undefined = undefined
  export let isOptionEnabled = (_option: O) => true
  export let getOptionLabel = (option: O, _index?: number) =>
    extractProperty(option, "label")
  export let getOptionValue = (option: O, _index?: number) =>
    extractProperty(option, "value")
  export let getOptionSubtitle = (option: O) =>
    extractProperty(option, "subtitle")
  export let getOptionColour: (
    _option: O,
    _index?: number
  ) => string | null = () => null

  const dispatch = createEventDispatcher<{ change: string | undefined }>()

  let open = false
  let wrapper: HTMLDivElement

  $: placeholder = !value
  $: selectedLabel = getSelectedLabel(value)
  $: fieldColour = getFieldAttribute(getOptionColour, value, options)

  const getFieldAttribute = (
    getAttribute: (_option: O, _index?: number) => string | null,
    value: string | undefined,
    options: O[]
  ) => {
    // Wait for options to load if there is a value but no options
    if (!options?.length) {
      return ""
    }
    const index = options.findIndex(
      (option, idx) => getOptionValue(option, idx) === value
    )
    return index !== -1 ? getAttribute(options[index], index) : null
  }
  const extractProperty = (value: O, property: string): string => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }

  const onChange = (newValue: string | undefined) => {
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
    open = false
  }

  const getSelectedLabel = (value: string | undefined) => {
    if (!value || !options?.length) {
      return ""
    }
    const selectedOption = options.find(x => getOptionValue(x) === value)
    if (!selectedOption) {
      return value
    }
    return getOptionLabel(selectedOption)
  }
</script>

<FancyField
  bind:ref={wrapper}
  {error}
  {value}
  {validate}
  {disabled}
  clickable
  on:click={() => (open = true)}
>
  {#if label}
    <FancyFieldLabel {placeholder}>{label}</FancyFieldLabel>
  {/if}

  {#if fieldColour}
    <span class="align">
      <StatusLight square color={fieldColour} />
    </span>
  {/if}

  <div class="value" class:placeholder>
    {selectedLabel || ""}
  </div>

  <div class="align arrow-alignment">
    <Icon name="caret-down" />
  </div>
</FancyField>

<div id="picker-wrapper">
  <Picker
    customAnchor={wrapper}
    bind:open
    {disabled}
    {options}
    {footer}
    {getOptionLabel}
    {getOptionValue}
    {getOptionSubtitle}
    {getOptionColour}
    {isOptionEnabled}
    isPlaceholder={value == null || value === ""}
    placeholderOption={placeholder === false ? undefined : placeholder}
    onSelectOption={onChange}
    isOptionSelected={option => option === value}
  />
</div>

<style>
  #picker-wrapper :global(.spectrum-Picker) {
    display: none;
  }
  .value {
    display: block;
    flex: 1 1 auto;
    font-size: 15px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-900);
    transition:
      transform 130ms ease-out,
      opacity 130ms ease-out;
    opacity: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 0;
    transform: translateY(9px);
  }

  .align {
    display: block;
    font-size: 15px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-900);
    transition:
      transform 130ms ease-out,
      opacity 130ms ease-out;
    transform: translateY(9px);
  }

  .arrow-alignment {
    transform: translateY(-2px);
  }
  .value.placeholder {
    transform: translateY(0);
    opacity: 0;
    pointer-events: none;
    margin-top: 0;
  }
</style>
