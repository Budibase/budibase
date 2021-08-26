<script>
  import { Select, Label, Combobox, Checkbox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { getAllStateVariables } from "builderStore/dataBinding"

  export let parameters
  export let bindings = []

  const keyOptions = getAllStateVariables()
  const typeOptions = [
    {
      label: "Set value",
      value: "set",
    },
    {
      label: "Delete value",
      value: "delete",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "set"
    }
  })
</script>

<div class="root">
  <Label small>Type</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  <Label small>Key</Label>
  <Combobox bind:value={parameters.key} options={keyOptions} />
  {#if parameters.type === "set"}
    <Label small>Value</Label>
    <DrawerBindableInput
      {bindings}
      value={parameters.value}
      on:change={e => (parameters.value = e.detail)}
    />
    <div />
    <Checkbox bind:value={parameters.persist} text="Persist this value" />
  {/if}
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
