<script>
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import "@spectrum-css/radio/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let direction = "vertical"
  export let value = []
  export let options = []
  export let error = null
  export let disabled = false
  export let getOptionLabel = option => option
  export let getOptionValue = option => option

  const dispatch = createEventDispatcher()

  const onChange = e => {
    const optionValue = e.target.value
    if (e.target.checked && !value.includes(optionValue)) {
      dispatch("change", [...value, optionValue])
    } else {
      dispatch(
        "change",
        value.filter(x => x !== optionValue)
      )
    }
  }
</script>

<div class={`spectrum-FieldGroup spectrum-FieldGroup--${direction}`}>
  {#if options && Array.isArray(options)}
    {#each options as option}
      {@const optionValue = getOptionValue(option)}
      <div
        title={getOptionLabel(option)}
        class="spectrum-Checkbox spectrum-FieldGroup-item"
        class:is-invalid={!!error}
      >
        <label
          class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-FieldGroup-item"
        >
          <input
            on:change={onChange}
            type="checkbox"
            class="spectrum-Checkbox-input"
            value={optionValue}
            checked={value.includes(optionValue)}
            {disabled}
          />
          <span class="spectrum-Checkbox-box">
            <svg
              class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark"
              focusable="false"
              aria-hidden="true"
            >
              <use xlink:href="#spectrum-css-icon-Checkmark100" />
            </svg>
          </span>
          <span class="spectrum-Checkbox-label">{getOptionLabel(option)}</span>
        </label>
      </div>
    {/each}
  {/if}
</div>

<style>
  .spectrum-Checkbox-input {
    opacity: 0;
  }
</style>
