<script>
  import Flatpickr from "svelte-flatpickr"
  import SpectrumField from "./SpectrumField.svelte"
  import "flatpickr/dist/flatpickr.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"

  export let field
  export let label
  export let placeholder

  let fieldState
  let fieldApi
  let value
  $: fieldApi?.setValue(value)
  $: flatpickrOptions = {
    element: `#${$fieldState?.id}-wrapper`,
    enableTime: true,
    altInput: true,
    altFormat: "F j Y, H:i",
  }

  const handleChange = event => {
    const [fullDate] = event.detail
    value = fullDate
  }
</script>

<SpectrumField {label} {field} bind:fieldState bind:fieldApi>
  {#if fieldState}
    <Flatpickr
      {value}
      options={flatpickrOptions}
      on:change={handleChange}
      element={`#${$fieldState.id}-wrapper`}>
      <div
        id={`${$fieldState.id}-wrapper`}
        aria-disabled="false"
        aria-invalid="false"
        class="flatpickr spectrum-InputGroup spectrum-Datepicker"
        aria-readonly="false"
        aria-required="false"
        aria-haspopup="true">
        <div class="spectrum-Textfield spectrum-InputGroup-textfield">
          <input
            data-input
            type="text"
            class="spectrum-Textfield-input spectrum-InputGroup-input"
            aria-invalid="false"
            {placeholder}
            id={$fieldState.id}
            value={$fieldState.value} />
        </div>
        <button
          type="button"
          class="spectrum-Picker spectrum-InputGroup-button"
          tabindex="-1">
          <svg
            class="spectrum-Icon spectrum-Icon--sizeM"
            focusable="false"
            aria-hidden="true"
            aria-label="Calendar">
            <use xlink:href="#spectrum-icon-18-Calendar" />
          </svg>
        </button>
      </div>
    </Flatpickr>
  {/if}
</SpectrumField>

<style>
  .flatpickr {
    width: var(
      --spectrum-alias-single-line-width,
      var(--spectrum-global-dimension-size-2400)
    );
  }
  .flatpickr .spectrum-Textfield {
    width: auto;
  }
</style>
