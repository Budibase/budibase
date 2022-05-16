<script>
  import Flatpickr from "svelte-flatpickr"
  import "flatpickr/dist/flatpickr.css"
  import "@spectrum-css/inputgroup/dist/index-vars.css"
  import "@spectrum-css/textfield/dist/index-vars.css"
  import "@spectrum-css/picker/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import { uuid } from "../../helpers"

  export let id = null
  export let disabled = false
  export let error = null
  export let enableTime = true
  export let value = null
  export let placeholder = null
  export let appendTo = undefined
  export let timeOnly = false

  const dispatch = createEventDispatcher()
  const flatpickrId = `${uuid()}-wrapper`
  let open = false
  let flatpickr, flatpickrOptions

  const resolveTimeStamp = timestamp => {
    let maskedDate = new Date(`0-${timestamp}`)

    if (maskedDate instanceof Date && !isNaN(maskedDate.getTime())) {
      return maskedDate
    } else {
      return null
    }
  }

  $: flatpickrOptions = {
    element: `#${flatpickrId}`,
    enableTime: timeOnly || enableTime || false,
    noCalendar: timeOnly || false,
    altInput: true,
    altFormat: timeOnly ? "H:i" : enableTime ? "F j Y, H:i" : "F j, Y",
    wrap: true,
    appendTo,
    disableMobile: "true",
    onReady: () => {
      let timestamp = resolveTimeStamp(value)
      if (timeOnly && timestamp) {
        dispatch("change", timestamp.toISOString())
      }
    },
  }

  const handleChange = event => {
    const [dates] = event.detail
    let newValue = dates[0]
    if (newValue) {
      newValue = newValue.toISOString()
    }
    // if time only set date component to 2000-01-01
    if (timeOnly) {
      newValue = `2000-01-01T${newValue.split("T")[1]}`
    }
    dispatch("change", newValue)
  }

  const clearDateOnBackspace = event => {
    if (["Backspace", "Clear", "Delete"].includes(event.key)) {
      dispatch("change", null)
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

  const parseDate = val => {
    if (!val) {
      return null
    }
    let date
    let time

    // it is a string like 00:00:00, just time
    let ts = resolveTimeStamp(val)

    if (timeOnly && ts) {
      date = ts
    } else if (val instanceof Date) {
      // Use real date obj if already parsed
      date = val
    } else if (isNaN(val)) {
      // Treat as date string of some sort
      date = new Date(val)
    } else {
      // Treat as numerical timestamp
      date = new Date(parseInt(val))
    }
    time = date.getTime()
    if (isNaN(time)) {
      return null
    }
    // By rounding to the nearest second we avoid locking up in an endless
    // loop in the builder, caused by potentially enriching {{ now }} to every
    // millisecond.
    return new Date(Math.floor(time / 1000) * 1000)
  }
</script>

{#key timeOnly}
  <Flatpickr
    bind:flatpickr
    value={parseDate(value)}
    on:open={onOpen}
    on:close={onClose}
    options={flatpickrOptions}
    on:change={handleChange}
    element={`#${flatpickrId}`}
  >
    <div
      id={flatpickrId}
      class:is-disabled={disabled}
      class:is-invalid={!!error}
      class="flatpickr spectrum-InputGroup spectrum-Datepicker"
      class:is-focused={open}
      aria-readonly="false"
      aria-required="false"
      aria-haspopup="true"
    >
      <div
        on:click={flatpickr?.open}
        class="spectrum-Textfield spectrum-InputGroup-textfield"
        class:is-disabled={disabled}
        class:is-invalid={!!error}
      >
        {#if !!error}
          <svg
            class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-icon-18-Alert" />
          </svg>
        {/if}
        <input
          data-input
          type="text"
          class="spectrum-Textfield-input spectrum-InputGroup-input"
          class:is-disabled={disabled}
          {placeholder}
          {id}
          {value}
        />
      </div>
      <button
        type="button"
        class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
        tabindex="-1"
        class:is-disabled={disabled}
        class:is-invalid={!!error}
        on:click={flatpickr?.open}
      >
        <svg
          class="spectrum-Icon spectrum-Icon--sizeM"
          focusable="false"
          aria-hidden="true"
          aria-label="Calendar"
        >
          <use xlink:href="#spectrum-icon-18-Calendar" />
        </svg>
      </button>
    </div>
  </Flatpickr>
{/key}
{#if open}
  <div class="overlay" on:mousedown|self={flatpickr?.close} />
{/if}

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
  :global(.flatpickr-calendar) {
    font-family: "Source Sans Pro", sans-serif;
  }
  .is-disabled {
    pointer-events: none !important;
  }
</style>
