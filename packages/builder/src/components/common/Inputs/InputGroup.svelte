<script>
  import { onMount } from "svelte"

  export let meta = []
  export let label = ""
  export let values = []
  export let type = "number"
  export let onChange = () => {}

  let _values = values.map(v => v)

  // $: onChange(_values)
</script>

<div class="input-container">
  <div class="label">{label}</div>
  <div class="inputs">
    {#each meta as { placeholder }, i}
      <input
        {type}
        placeholder={placeholder || ''}
        value={values[i]}
        on:input={e => (_values[i] = e.target.value)} />
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
    /* display: flex;
    justify-content: space-between; */
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
