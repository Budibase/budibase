<script>
  import { Label, TextArea } from "@budibase/bbui"

  export let type
  export let name
  export let value
  export let error
</script>

<div class="form-row">
  <Label>{name}</Label>
  <TextArea on:blur on:change {type} {value} {error} />
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
