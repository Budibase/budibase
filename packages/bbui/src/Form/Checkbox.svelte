<script lang="ts">
  import Field from "./Field.svelte"
  import Checkbox from "./Core/Checkbox.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: boolean | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: "above" | "below" = "above"
  export let text: string | undefined = undefined
  export let disabled: boolean = false
  export let error: string | undefined = undefined
  export let size: "S" | "M" | "L" | "XL" = "M"
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
