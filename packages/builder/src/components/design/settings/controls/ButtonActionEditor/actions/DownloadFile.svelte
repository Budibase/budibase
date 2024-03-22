<script>
  import { Label } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Label small>File</Label>
  <DrawerBindableInput
    title="State value"
    {bindings}
    value={parameters.value}
    on:change={e => (parameters.value = e.detail)}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    margin: 0 auto;
  }
</style>
