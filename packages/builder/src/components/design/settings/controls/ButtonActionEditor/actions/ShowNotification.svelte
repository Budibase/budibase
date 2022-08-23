<script>
  import { Select, Label, Checkbox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  const types = [
    {
      label: "Success",
      value: "success",
    },
    {
      label: "Warning",
      value: "warning",
    },
    {
      label: "Error",
      value: "error",
    },
    {
      label: "Info",
      value: "info",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "success"
    }
    if (parameters.autoDismiss == null) {
      parameters.autoDismiss = true
    }
  })
</script>

<div class="root">
  <Label>Type</Label>
  <Select bind:value={parameters.type} options={types} placeholder={null} />
  <Label>Message</Label>
  <DrawerBindableInput
    {bindings}
    value={parameters.message}
    on:change={e => (parameters.message = e.detail)}
  />
  <Label />
  <Checkbox text="Auto dismiss" bind:value={parameters.autoDismiss} />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
