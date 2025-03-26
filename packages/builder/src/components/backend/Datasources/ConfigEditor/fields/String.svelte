<script lang="ts">
  import { Label } from "@budibase/bbui"
  import EnvVariableInput from "@/components/portal/environment/EnvVariableInput.svelte"

  export let type
  export let name
  export let value
  export let error
  export let placeholder
</script>

<div class="form-row">
  <Label>{name}</Label>
  <EnvVariableInput
    on:change
    on:blur
    type={type === "port" ? "string" : type}
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
