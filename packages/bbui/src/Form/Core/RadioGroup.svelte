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

  const dispatch = createEventDispatcher()
  const onChange = e => dispatch("change", e.target.value)
</script>

<div class={`spectrum-FieldGroup spectrum-FieldGroup--${direction}`}>
  {#if options && Array.isArray(options)}
    {#each options as option}
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
