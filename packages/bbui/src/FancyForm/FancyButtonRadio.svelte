<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import FancyFieldLabel from "./FancyFieldLabel.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  type Option = string | { label?: string; value?: string }

  export let label: string | undefined = undefined
  export let value: string | undefined = undefined
  export let disabled: boolean = false
  export let error: string | null = null
  export let validate: ((value: string | undefined) => string | null) | null =
    null
  export let options: Option[] = []
  export let getOptionLabel: (option: Option) => string | undefined = option =>
    extractProperty(option, "label")
  export let getOptionValue: (option: Option) => string | undefined = option =>
    extractProperty(option, "value")

  const dispatch = createEventDispatcher<{ change: string | undefined }>()

  const extractProperty = (value: Option, property: "label" | "value") => {
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
