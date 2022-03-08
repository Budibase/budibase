<script>
  import { Label, Select, Body } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import { onMount } from "svelte"

  export let parameters
  $: tableOptions = $tables.list || []

  const FORMATS = [
    {
      label: "CSV",
      value: "csv",
    },
    {
      label: "JSON",
      value: "json",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "csv"
    }
  })
</script>

<div class="root">
  <Body size="S">
    Choose the table that you would like to export your row selection from.
    <br />
    Please ensure you have enabled row selection in the table settings
  </Body>

  <div class="params">
    <Label small>Table</Label>
    <Select
      bind:value={parameters.tableId}
      options={tableOptions}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />

    <Label small>Type</Label>
    <Select bind:value={parameters.type} options={FORMATS} />
  </div>
</div>

<style>
  .root {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 100px 1fr;
    align-items: center;
  }
</style>
