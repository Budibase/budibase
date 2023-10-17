<script>
  import { Label } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <span>
    You can optionally navigate to another screen after closing the screen
    modal.
  </span>
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
  span {
    grid-column: 1 / 3;
  }
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
