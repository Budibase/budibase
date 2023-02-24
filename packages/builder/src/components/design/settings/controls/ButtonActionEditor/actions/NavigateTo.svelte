<script>
  import { Label, Checkbox } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Label small>Screen or URL</Label>
  <DrawerBindableInput
    title="Destination URL"
    placeholder="/route"
    value={parameters.url}
    on:change={value => (parameters.url = value.detail)}
    {bindings}
  />
  <div />
  <Checkbox text="Open screen in modal" bind:value={parameters.peek} />
  <Checkbox
    text="Open external link in new tab"
    bind:value={parameters.externalNewTab}
  />
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
