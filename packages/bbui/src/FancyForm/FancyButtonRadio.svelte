<script>
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  export let label
  export let value
  export let disabled = false
  export let error = null
  export let validate = null
  export let options = []
  export let getOptionLabel = option => extractProperty(option, "label")
  export let getOptionValue = option => extractProperty(option, "value")

  const dispatch = createEventDispatcher()

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
  }
</script>

<FancyField {error} {value} {validate} {disabled} autoHeight>
  {#if label}
    <FancyFieldLabel placeholder={false}>{label}</FancyFieldLabel>
  {/if}

  <div class="options">
    {#each options as option}
      <ActionButton
        selected={getOptionValue(option) === value}
        on:click={() => onChange(getOptionValue(option))}
      >
        {getOptionLabel(option)}
      </ActionButton>
    {/each}
  </div>
</FancyField>

<style>
  .options {
    margin-top: 34px;
    margin-bottom: 14px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .options :global(.spectrum-ActionButton) {
    font-size: 15px;
    line-height: 17px;
    height: auto;
    padding: 6px 10px;
  }
</style>
