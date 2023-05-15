<script>
  import Table from "./Table.svelte"

  export let query = {}
  export let data = []
  export let editRows = false

  let loading = false
  let error = false
  let type = "external"
</script>

{#if error}
  <div class="errors">{error}</div>
{/if}
<Table
  schema={query.schema}
  {data}
  {loading}
  {type}
  rowCount={5}
  allowEditing={editRows}
/>

<style>
  .errors {
    color: var(--red);
    background: var(--red-light);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-m);
    margin-bottom: var(--spacing-m);
  }
</style>
