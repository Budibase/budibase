<script>
  import "@spectrum-css/switch/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let id = null
  export let text = null
  export let disabled = false

  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event.target.checked)
  }
</script>

<div class="spectrum-Switch spectrum-Switch--emphasized">
  <input
    checked={value}
    {disabled}
    on:change={onChange}
    on:click
    on:click|stopPropagation
    {id}
    type="checkbox"
    class="spectrum-Switch-input"
  />
  <span class="spectrum-Switch-switch" />
  {#if text}
    <label class="spectrum-Switch-label" for={id}>{text}</label>
  {/if}
</div>

<style>
  .spectrum-Switch-input {
    opacity: 0;
  }
</style>
