<script>
  import { onMount } from "svelte"

  export let meta = []
  export let label = ""
  export let value = [0, 0, 0, 0]
  export let type = "number"
  export let onChange = () => {}

  function handleChange(val, idx) {
    value.splice(idx, 1, val)
    value = value
    onChange(value)
  }
</script>

<div class="input-container">
  <div class="label">{label}</div>
  <div class="inputs">
    {#each meta as { placeholder }, i}
      <input
        {type}
        placeholder={placeholder || ''}
        value={value[i] === 0 ? '' : value[i]}
        on:change={e => handleChange(e.target.value || 0, i)} />
    {/each}
  </div>
</div>

<style>
  .input-container {
    display: flex;
  }

  .label {
    flex: 0;
  }

  .inputs {
    flex: 1;
  }

  input {
    width: 40px;
    height: 32px;
    font-size: 13px;
    font-weight: 700;
    margin: 0px 5px;
    color: #163057;
    opacity: 0.7;
    padding: 5px 10px;
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    outline: none;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  input::placeholder {
    text-align: center;
  }
</style>
