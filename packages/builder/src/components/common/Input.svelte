<script>
  import {onMount} from "svelte"
  import { buildStyle } from "../../helpers.js"
  export let value = ""
  export let textAlign = "left"
  export let width = "160px"
  export let placeholder = ""
  
  let centerPlaceholder = textAlign === "center"

  let style = buildStyle({ width, textAlign })
</script>

<input class:centerPlaceholder type="text" {placeholder} {style} on:change bind:value />

<style>
  input {
    width: 32px;
    height: 32px;
    font-size: 12px;
    font-weight: 700;
    margin: 0px 0px 0px 1px;
    color: var(--ink);
    opacity: 0.7;
    padding: 0px 4px;
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
