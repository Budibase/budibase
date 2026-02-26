<script lang="ts" generics="O extends any,V">
  import Select from "./Select.svelte"
  import type { LabelPosition } from "../types"

  export let value: V | undefined = undefined
  export let label: string | undefined = undefined
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let labelPosition: LabelPosition = "above"
  export let error: string | undefined = undefined
  export let placeholder: string | boolean = false
  export let options: O[] = []
  export let getOptionLabel = (option: O, _index?: number) =>
    extractProperty(option, "label")
  export let getOptionValue = (option: O, _index?: number) =>
    extractProperty(option, "value")
  export let getOptionSubtitle = (option: O, _index?: number) =>
    (option as any)?.subtitle
  export let helpText: string | undefined = undefined
  export let required: boolean = false
  export let description: string | undefined = undefined

  const extractProperty = (value: any, property: any) => {
    if (value && typeof value === "object") {
      return value[property]
    }
    return value
  }
</script>

<div class="role-picker">
  <Select
    {label}
    {disabled}
    {readonly}
    {labelPosition}
    {error}
    {placeholder}
    {options}
    {getOptionLabel}
    {getOptionValue}
    {getOptionSubtitle}
    showSelectedSubtitle={true}
    {helpText}
    {required}
    {description}
    bind:value
    on:change
    on:click
  />
</div>

<style>
  .role-picker :global(.spectrum-Picker) {
    height: auto;
    align-items: center;
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
  }
</style>
