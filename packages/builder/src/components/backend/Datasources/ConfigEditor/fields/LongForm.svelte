<script lang="ts">
  import { Label, TextArea } from "@budibase/bbui"

  export let name
  export let value
  export let error
  export let placeholder
  export let tooltip: string | undefined = undefined
</script>

<div class="form-row">
  <Label {tooltip}>{name}</Label>
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
