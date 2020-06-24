<script>
  import { onMount } from "svelte"
  import { buildStyle } from "../../helpers.js"
  export let value = ""
  export let name = ""
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

  $: displayValue =
    suffix && value && value.endsWith(suffix)
      ? value.replace(new RegExp(`${suffix}$`), "")
      : value || ""
</script>

<input
  {name}
  class:centerPlaceholder
  type="text"
  value={displayValue}
  {placeholder}
  {style}
  on:change={e => handleChange(e.target.value)} />

<style>
  input {
    /* width: 32px; */
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    margin: 0px 0px 0px 2px;
    color: var(--ink);
    padding: 0px 8px;
    font-family: inter;
    width: 164px;
    box-sizing: border-box;
    background-color: var(--grey-2);
    border-radius: 4px;
    border: 1px solid var(--grey-2);
    outline: none;
  }

  input::placeholder {
    text-align: left;
  }

  .centerPlaceholder::placeholder {
    text-align: center;
  }
</style>
