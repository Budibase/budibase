<script lang="ts">
  import Field from "./Field.svelte"
  import Checkbox from "./Core/Checkbox.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: boolean | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition = "above"
  export let text: string | undefined = undefined
  export let disabled = false
  export let error: string | undefined = undefined
  export let size = "M"
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<boolean>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Checkbox {disabled} {text} {value} {size} on:change={onChange} />
</Field>
