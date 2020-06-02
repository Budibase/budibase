<script>
  import {onMount} from "svelte"
  import { buildStyle } from "../../helpers.js"
  export let value = ""
  export let textAlign = "left"
  export let width = "160px"
  export let placeholder = ""
  export let suffix = ""
  export let onChange = val => {}
  
  let centerPlaceholder = textAlign === "center"

  let style = buildStyle({ width, textAlign })
  
  function handleChange(val) {
    value = val
    let _value = value !== "auto" ? value + suffix : value
    onChange(_value)
  }

  $: displayValue = suffix && value.endsWith(suffix) ? value.replace(new RegExp(`${suffix}$`), "") : value
  
</script>

<input class:centerPlaceholder type="text" value={displayValue} {placeholder} {style} on:change={e => handleChange(e.target.value)} />

<style>
  input {
    /* width: 32px; */
    height: 32px;
    font-size: 12px;
    font-weight: 700;
    margin: 0px 0px 0px 1px;
    color: var(--ink);
    opacity: 0.7;
    padding: 0px 4px;
    line-height: 1.3;
    /* padding: 12px; */
    width: 164px;
    box-sizing: border-box;
    border: 1px solid var(--grey);
    border-radius: 2px;
    outline: none;
  }

  input::placeholder {    
    text-align: left;
  }

  .centerPlaceholder::placeholder {
    text-align: center;
  }
</style>
