<script>
  import { Select, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters

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
  })
</script>

<div class="root">
  <Label small>Type</Label>
  <Select bind:value={parameters.type} options={types} placeholder={null} />
  <Label small>Message</Label>
  <DrawerBindableInput
    value={parameters.message}
    on:change={e => (parameters.message = e.detail)}
  />
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
