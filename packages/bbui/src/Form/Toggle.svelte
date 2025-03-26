<script lang="ts">
  import Field from "./Field.svelte"
  import Switch from "./Core/Switch.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = undefined
  export let label = null
  export let labelPosition = "above"
  export let text = undefined
  export let disabled = false
  export let error: string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<boolean>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Switch {disabled} {text} {value} on:change={onChange} on:click />
</Field>
