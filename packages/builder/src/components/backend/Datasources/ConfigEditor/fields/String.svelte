<script lang="ts">
  import type { EnvDropdownType } from "@budibase/bbui"
  import { Label } from "@budibase/bbui"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  export let type: string
  export let name: string
  export let value: string
  export let error: string | undefined
  export let placeholder: string | undefined

  $: inputType = type === "port" ? "text" : (type as EnvDropdownType)
</script>

<div class="form-row">
  <Label>{name}</Label>
  <EnvVariableInput
    on:change
    on:blur
    type={inputType}
    {value}
    {error}
    {placeholder}
  />
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
