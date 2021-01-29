<script>
  import Flatpickr from "svelte-flatpickr"
  import SpectrumField from "./SpectrumField.svelte"
  import "flatpickr/dist/flatpickr.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"

  export let field
  export let label
  export let placeholder
  export let enableTime

  let fieldState
  let fieldApi
  let open = false
  let flatpickr

  $: flatpickrOptions = {
    element: `#${$fieldState?.id}-wrapper`,
    enableTime: enableTime || false,
    altInput: true,
    altFormat: enableTime ? "F j Y, H:i" : "F j, Y",
  }

  const handleChange = event => {
    const [dates] = event.detail
    fieldApi.setValue(dates[0])
  }

  const onOpen = () => {
    open = true
  }

  const onClose = () => {
    open = false

    // Manually blur all input fields since flatpickr creates a second
    // duplicate input field.
    // We need to blur both because the focus styling does not get properly
    // applied.
    const els = document.querySelectorAll(`#${$fieldState.id}-wrapper input`)
    els.forEach(el => el.blur())
  }
</script>

<SpectrumField {label} {field} bind:fieldState bind:fieldApi>
  {#if fieldState}
    <Flatpickr
      bind:flatpickr
      value={$fieldState.value}
      on:open={onOpen}
      on:close={onClose}
      options={flatpickrOptions}
      on:change={handleChange}
      element={`#${$fieldState.id}-wrapper`}>
      <div
        id={`${$fieldState.id}-wrapper`}
        aria-disabled="false"
        aria-invalid="false"
        class="flatpickr spectrum-InputGroup spectrum-Datepicker"
        class:is-focused={open}
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
          tabindex="-1"
          on:click={flatpickr?.open}>
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
