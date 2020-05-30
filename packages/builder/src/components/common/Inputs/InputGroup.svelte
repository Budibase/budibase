<script>
  import { onMount } from "svelte"
  import Input from "../Input.svelte"

  export let meta = []
  export let label = ""
  export let value = ["0", "0", "0", "0"]
  export let type = "number"
  export let onChange = () => {}

  function handleChange(val, idx) {
    value.splice(idx, 1, val)
    value = value
    console.log("IDX",idx)
    let _value = value.map(v => !/px$/.test(v) ? `${v}px` : v)
    onChange(_value)
  }

  $: displayValues = value.map(v => v.toString().replace(/px$/, ""))
</script>

<div class="input-container">
  <div class="label">{label}</div>
  <div class="inputs">
    {#each meta as { placeholder }, i}

        <Input width="32px" textAlign="center" placeholder={placeholder || ""} value={!displayValues || displayValues[i] === 0 ? '' : displayValues[i]} on:change={e => handleChange(e.target.value || 0, i)} />
        
    {/each}
  </div>
</div>

<style>

  .label {
    flex: 0;
  }

  .inputs {
    flex: 1;
  }

 
</style>
