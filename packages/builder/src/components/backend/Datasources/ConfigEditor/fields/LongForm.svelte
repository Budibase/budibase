<script lang="ts">
  import { Label, TextArea } from "@budibase/bbui"

  export let name: string
  export let value: string
  export let error: string | undefined
  export let placeholder: string | undefined
</script>

<div class="form-row">
  <Label>{name}</Label>
  <TextArea on:blur on:change {value} {error} {placeholder} />
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
