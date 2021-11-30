<script>
  import { Divider, Heading, ActionButton, Badge } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let datasource

  let addHeader
</script>

<Divider />
<div class="query-header">
  <div class="badge">
    <Heading size="S">Headers</Heading>
    <Badge quiet grey>Optional</Badge>
  </div>
  <ActionButton size="S" icon="Add" on:click={() => addHeader.addEntry()}
    >Add Header</ActionButton
  >
</div>
<KeyValueBuilder
  bind:this={addHeader}
  bind:object={datasource.config.defaultHeaders}
  on:change
  noAddButton
/>

<style>
  .query-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 var(--spacing-s) 0;
  }

  .badge {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
