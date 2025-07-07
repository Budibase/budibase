<script lang="ts">
  import { Label, Select } from "@budibase/bbui"

  export let name: string
  export let value: string | undefined
  export let error: string | undefined
  export let config: { options: string[] }
  export let placeholder: string | undefined
</script>

<div class="form-row">
  <Label>{name}</Label>
  <Select
    on:blur
    on:change
    options={config.options}
    value={value || undefined}
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
