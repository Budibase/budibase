<script>
  import "@spectrum-css/switch/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let error = null
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
    {id}
    type="checkbox"
    class="spectrum-Switch-input"
  />
  <span class="spectrum-Switch-switch" />
  <label class="spectrum-Switch-label" for={id}>{text}</label>
</div>
