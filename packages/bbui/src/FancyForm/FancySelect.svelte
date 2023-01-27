<script>
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import Icon from "../Icon/Icon.svelte"
  import Popover from "../Popover/Popover.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"

  export let label
  export let value
  export let disabled = false
  export let error = null
  export let validate = null
  export let options = []
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")

  const dispatch = createEventDispatcher()

  let open = false
  let popover
  let wrapper

  $: placeholder = !value
  $: selectedLabel = getSelectedLabel(value)

  const extractProperty = (value, property) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }

  const onChange = newValue => {
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
    open = false
  }

  const getSelectedLabel = value => {
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

  <div class="value" class:placeholder>
    {selectedLabel || ""}
  </div>

  <div class="arrow">
    <Icon name="ChevronDown" />
  </div>
</FancyField>

<Popover
  anchor={wrapper}
  align="left"
  portalTarget={document.documentElement}
  bind:this={popover}
  {open}
  on:close={() => (open = false)}
  useAnchorWidth={true}
  maxWidth={null}
>
  <div class="popover-content">
    {#if options.length}
      {#each options as option, idx}
        <div
          class="popover-option"
          tabindex="0"
          on:click={() => onChange(getOptionValue(option, idx))}
        >
          <span class="option-text">
            {getOptionLabel(option, idx)}
          </span>
          {#if value === getOptionValue(option, idx)}
            <Icon name="Checkmark" />
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</Popover>

<style>
  .value {
    display: block;
    flex: 1 1 auto;
    font-size: 15px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-900);
    transition: transform 130ms ease-out, opacity 130ms ease-out;
    opacity: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 0;
    transform: translateY(9px);
  }
  .value.placeholder {
    transform: translateY(0);
    opacity: 0;
    pointer-events: none;
    margin-top: 0;
  }
  .popover-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 7px 0;
  }
  .popover-option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 7px 16px;
    transition: background 130ms ease-out;
    font-size: 15px;
  }
  .popover-option:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
