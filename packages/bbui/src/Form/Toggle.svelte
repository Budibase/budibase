<script lang="ts">
  import Field from "./Field.svelte"
  import Switch from "./Core/Switch.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: boolean | null | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: "above" = "above"
  export let text: string | undefined = undefined
  export let disabled: boolean | undefined = false
  export let error: string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<boolean>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Switch
    {disabled}
    {text}
    value={value ?? undefined}
    on:change={onChange}
    on:click
  />
</Field>
