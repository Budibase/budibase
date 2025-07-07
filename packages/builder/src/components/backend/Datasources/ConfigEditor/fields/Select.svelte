<script lang="ts">
  import { Label, Select } from "@budibase/bbui"

  export let name
  export let value
  export let error
  export let config
  export let placeholder
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
