<script>
  import { Combobox } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import { createEventDispatcher } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"

  export let value = ""
  export let bindings = []
  export let placeholder
  export let label
  export let disabled = false
  export let options
  export let appendBindingsAsOptions = true
  export let error

  const dispatch = createEventDispatcher()

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: isJS = isJSBinding(value)
  $: allOptions = buildOptions(options, bindings, appendBindingsAsOptions)

  const onChange = (value, optionPicked) => {
    // Add HBS braces if picking binding
    if (optionPicked && !options?.includes(value)) {
      value = `{{ ${value} }}`
    }

    dispatch("change", readableToRuntimeBinding(bindings, value))
  }

  const buildOptions = (options, bindings, appendBindingsAsOptions) => {
    if (!appendBindingsAsOptions) {
      return options
    }
    return []
      .concat(options || [])
      .concat(bindings?.map(binding => binding.readableBinding) || [])
  }
</script>

<div class="control" class:disabled>
  <Combobox
    {label}
    {disabled}
    readonly={isJS}
    value={isJS ? "(JavaScript function)" : readableValue}
    on:type={e => onChange(e.detail, false)}
    on:pick={e => onChange(e.detail, true)}
    on:blur={() => dispatch("blur")}
    {placeholder}
    options={allOptions}
    {error}
  />
</div>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .control:not(.disabled) :global(.spectrum-Textfield-input) {
    padding-right: 40px;
  }
</style>
