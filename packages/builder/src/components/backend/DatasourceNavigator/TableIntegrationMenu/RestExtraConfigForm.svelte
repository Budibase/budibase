<script>
  import { Divider, Heading, Button } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let datasource

  let addHeader
</script>

<Divider />
<div class="query-header">
  <Heading size="S">Headers</Heading>
  <Button secondary on:click={() => addHeader.addEntry()}>Add Header</Button>
</div>
<KeyValueBuilder
  bind:this={addHeader}
  bind:object={datasource.config.defaultHeaders}
  noAddButton={true}
/>

<style>
  .query-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 var(--spacing-s) 0;
  }
</style>
