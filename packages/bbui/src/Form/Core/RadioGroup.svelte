<script>
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import "@spectrum-css/radio/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let direction = "vertical"
  export let value = null
  export let options = []
  export let disabled = false
  export let readonly = false
  export let getOptionLabel = option => option
  export let getOptionValue = option => option
  export let getOptionTitle = option => option
  export let getOptionSubtitle = option => option?.subtitle ?? undefined
  export let getOptionDisabled = option => option?.disabled ?? false
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
      {@const isOptionDisabled = disabled || getOptionDisabled(option)}
      {@const optionLabel = getOptionLabel(option)}
      {@const optionSubtitle = getOptionSubtitle(option)}
      <div
        title={getOptionTitle(option)}
        class="spectrum-Radio spectrum-FieldGroup-item spectrum-Radio--emphasized"
        class:readonly
      >
        <input
          on:change={onChange}
          bind:group={value}
          value={getOptionValue(option)}
          type="radio"
          class="spectrum-Radio-input"
          disabled={isOptionDisabled}
        />
        <span class="spectrum-Radio-button"></span>
        <label for="" class="spectrum-Radio-label radio-label">
          <span class="radio-label-text">{optionLabel}</span>
          {#if optionSubtitle && optionSubtitle !== optionLabel}
            <span class="radio-label-subtitle">
              {optionSubtitle}
            </span>
          {/if}
        </label>
      </div>
    {/each}
  {/if}
</div>

<style>
  .spectrum-Radio-input {
    opacity: 0;
  }
  .readonly {
    pointer-events: none;
  }
  .radio-label-subtitle {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
