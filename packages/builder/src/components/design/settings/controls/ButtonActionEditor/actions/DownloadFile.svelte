<script>
  import { Label } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: fileBindings = bindings?.filter(
    b => b.fieldSchema?.type === FieldType.ATTACHMENT
  )
</script>

<div class="root">
  <Label small>File</Label>
  <DrawerBindableInput
    title="State value"
    bindings={fileBindings}
    value={parameters.value}
    allowHelpers={false}
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
