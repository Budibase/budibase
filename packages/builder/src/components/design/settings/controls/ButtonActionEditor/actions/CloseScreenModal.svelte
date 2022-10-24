<script>
  import { Label, Body } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<Body size="S">Navigate To screen, or leave blank.</Body>
<br />
<div class="root">
  <Label small>Screen</Label>
  <DrawerBindableInput
    title="Destination URL"
    placeholder="/screen"
    value={parameters.url}
    on:change={value => (parameters.url = value.detail)}
    {bindings}
  />
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
