<script>
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import "@spectrum-css/radio/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let direction = "vertical"
  export let value = null
  export let options = []
  export let error = null
  export let disabled = false
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let getOptionTitle = option => option
  export let sort = false

  const dispatch = createEventDispatcher()
  const onChange = e => dispatch("change", e.target.value)

  const getSortedOptions = (options, getLabel, sort) => {
    if (!options?.length || !Array.isArray(options)) {
      return []
    }
    if (!sort) {
      return options
    }
    return [...options].sort((a, b) => {
      const labelA = getLabel(a)
      const labelB = getLabel(b)
      return labelA > labelB ? 1 : -1
    })
  }

  $: parsedOptions = getSortedOptions(options, getOptionLabel, sort)
</script>

<div class={`spectrum-FieldGroup spectrum-FieldGroup--${direction}`}>
  {#if parsedOptions && Array.isArray(parsedOptions)}
    {#each parsedOptions as option}
      <div
        title={getOptionTitle(option)}
        class="spectrum-Radio spectrum-FieldGroup-item spectrum-Radio--emphasized"
        class:is-invalid={!!error}
      >
        <input
          on:change={onChange}
          bind:group={value}
          value={getOptionValue(option)}
          type="radio"
          class="spectrum-Radio-input"
          {disabled}
        />
        <span class="spectrum-Radio-button" />
        <label for="" class="spectrum-Radio-label">
          {getOptionLabel(option)}
        </label>
      </div>
    {/each}
  {/if}
</div>

<style>
  .spectrum-Radio-input {
    opacity: 0;
  }
</style>
