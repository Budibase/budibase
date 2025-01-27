<script>
  export let value
  export let min
  export let max
  export let hideArrows = false
  export let width
  export let type = "number"

  $: style = width ? `width:${width}px;` : ""
</script>

<input
  class:hide-arrows={hideArrows}
  {type}
  {style}
  {value}
  {min}
  {max}
  onclick="this.select()"
  on:change
  on:input
/>

<style>
  input {
    background: none;
    border: none;
    outline: none;
    color: var(--spectrum-alias-text-color);
    padding: 4px 6px 5px 6px;
    border-radius: 4px;
    transition: background 130ms ease-out;
    font-size: 18px;
    font-weight: bold;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    box-sizing: content-box !important;
  }
  input:focus,
  input:hover {
    --space: 30px;
    background: var(--spectrum-global-color-gray-200);
    z-index: 1;
  }

  /* Hide built-in arrows */
  input.hide-arrows::-webkit-outer-spin-button,
  input.hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.hide-arrows {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
  }
</style>
