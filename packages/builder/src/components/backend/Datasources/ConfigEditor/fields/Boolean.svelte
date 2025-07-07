<script>
  import { Label, Toggle } from "@budibase/bbui"

  export let value
  export let name
</script>

<div class="form-row">
  <Label>{name}</Label>
  <Toggle on:blur on:change text="" {value} />
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
