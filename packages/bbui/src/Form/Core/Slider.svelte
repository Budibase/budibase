<script>
  import "@spectrum-css/slider/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let id = null
  export let disabled = false
  export let min = 0
  export let max = 100
  export let step = 1

  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event.target.value)
  }
</script>

<div>
  <input
    type="range"
    {min}
    {max}
    {step}
    {value}
    {disabled}
    {id}
    on:change={onChange}
  />
</div>

<style>
  div {
    display: grid;
    place-items: center;
  }

  input {
    width: 100%;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
    background: transparent;
  }
  input::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input:focus {
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid var(--spectrum-global-color-gray-700);
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: var(--background);
    cursor: pointer;
    transition: background 130ms ease-out;
    margin-top: -7px;
  }
  input[type="range"]::-moz-range-thumb {
    border: 2px solid var(--spectrum-global-color-gray-700);
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: var(--background);
    cursor: pointer;
    transition: background 130ms ease-out;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: var(--spectrum-global-color-gray-300);
    border-radius: 2px;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: var(--spectrum-global-color-gray-300);
    border-radius: 2px;
  }
</style>
