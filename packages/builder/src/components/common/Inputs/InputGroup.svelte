<script>
  import { onMount } from "svelte"
  import Input from "../Input.svelte"

  export let meta = []
  export let label = ""
  export let value = ["0", "0", "0", "0"]
  export let suffix = ""

  export let onChange = () => {}

  function handleChange(val, idx) {
    value.splice(idx, 1, val !== "auto" ? val + suffix : val)
    
    value = value
    let _value = value.map(v => (!v.endsWith(suffix) && v !== "auto" ? v + suffix : v))
    onChange(_value)
  }

  $: displayValues = value
    ? value.map(v => v.replace(new RegExp(`${suffix}$`), ""))
    : []
</script>

<div class="input-container">
  <div class="label">{label}</div>
  <div class="inputs-group">
    {#each meta as m, i}
      <Input
        width="32px"
        textAlign="center"
        placeholder={m.placeholder || ''}
        value={!displayValues || displayValues[i] === '0' ? '' : displayValues[i]}
        onChange={value => handleChange(value || 0, i)} />
    {/each}
  </div>
</div>

<style>
  .label {
    flex: 0;
  }

  .inputs-group {
    flex: 1;
  }

</style>
