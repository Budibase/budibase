<script>
  import Flatpickr from "svelte-flatpickr"
  import Field from "./Field.svelte"
  import "flatpickr/dist/flatpickr.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import { generateID } from "../helpers"

  export let field
  export let label
  export let placeholder
  export let enableTime
  export let disabled = false

  let fieldState
  let fieldApi
  let open = false
  let flatpickr

  $: flatpickrId = `${$fieldState?.id}-${generateID()}-wrapper`
  $: flatpickrOptions = {
    element: `#${flatpickrId}`,
    enableTime: enableTime || false,
    altInput: true,
    altFormat: enableTime ? "F j Y, H:i" : "F j, Y",
  }

  const handleChange = event => {
    const [dates] = event.detail
    fieldApi.setValue(dates[0])
  }

  const clearDateOnBackspace = event => {
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      fieldApi.setValue(null)
      flatpickr.close()
    }
  }

  const onOpen = () => {
    open = true
    document.addEventListener("keyup", clearDateOnBackspace)
  }

  const onClose = () => {
    open = false
    document.removeEventListener("keyup", clearDateOnBackspace)

    // Manually blur all input fields since flatpickr creates a second
    // duplicate input field.
    // We need to blur both because the focus styling does not get properly
    // applied.
    const els = document.querySelectorAll(`#${flatpickrId} input`)
    els.forEach(el => el.blur())
  }
</script>

<Field {label} {field} {disabled} type="datetime" bind:fieldState bind:fieldApi>
  {#if fieldState}
    <Flatpickr
      bind:flatpickr
      value={$fieldState.value}
      on:open={onOpen}
      on:close={onClose}
      options={flatpickrOptions}
      on:change={handleChange}
      element={`#${flatpickrId}`}>
      <div
        id={flatpickrId}
        aria-disabled="false"
        aria-invalid={!$fieldState.valid}
        class:is-disabled={$fieldState.disabled}
        class:is-invalid={!$fieldState.valid}
        class="flatpickr spectrum-InputGroup spectrum-Datepicker"
        class:is-focused={open}
        aria-readonly="false"
        aria-required="false"
        aria-haspopup="true">
        <div
          on:click={flatpickr?.open}
          class="spectrum-Textfield spectrum-InputGroup-textfield"
          class:is-disabled={$fieldState.disabled}
          class:is-invalid={!$fieldState.valid}>
          {#if !$fieldState.valid}
            <svg
              class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
              focusable="false"
              aria-hidden="true">
              <use xlink:href="#spectrum-icon-18-Alert" />
            </svg>
          {/if}
          <input
            data-input
            type="text"
            disabled={$fieldState.disabled}
            class="spectrum-Textfield-input spectrum-InputGroup-input"
            aria-invalid={!$fieldState.valid}
            {placeholder}
            id={$fieldState.fieldId}
            value={$fieldState.value} />
        </div>
        <button
          type="button"
          class="spectrum-Picker spectrum-InputGroup-button"
          tabindex="-1"
          disabled={$fieldState.disabled}
          class:is-invalid={!$fieldState.valid}
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
    {#if open}
      <div class="overlay" on:mousedown|self={flatpickr?.close} />
    {/if}
  {/if}
</Field>

<style>
  .spectrum-Textfield-input {
    pointer-events: none;
  }
  .spectrum-Textfield:not(.is-disabled):hover {
    cursor: pointer;
  }
  .flatpickr {
    width: 100%;
    overflow: hidden;
  }
  .flatpickr .spectrum-Textfield {
    width: 100%;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
</style>
