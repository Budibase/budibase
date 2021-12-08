<script>
  import { Divider, Heading, ActionButton, Badge, Body } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import RestAuthenticationBuilder from "./RestAuthenticationBuilder.svelte"

  export let datasource

  let addHeader
</script>

<Divider size="S" />
<div class="section-header">
  <div class="badge">
    <Heading size="S">Headers</Heading>
    <Badge quiet grey>Optional</Badge>
  </div>
</div>
<Body size="S">
  Headers enable you to provide additional information about the request, such
  as format.
</Body>
<KeyValueBuilder
  bind:this={addHeader}
  bind:object={datasource.config.defaultHeaders}
  on:change
  noAddButton
/>
<div>
  <ActionButton icon="Add" on:click={() => addHeader.addEntry()}>
    Add header
  </ActionButton>
</div>

<Divider size="S" />
<div class="section-header">
  <div class="badge">
    <Heading size="S">Authentication</Heading>
    <Badge quiet grey>Optional</Badge>
  </div>
</div>
<Body size="S">
  Create an authentication config that can be shared with queries.
</Body>
<RestAuthenticationBuilder bind:authConfigs={datasource.config.authConfigs} />
<div>
  <ActionButton icon="Add">Add authentication</ActionButton>
</div>

<style>
  .section-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    display: flex;
    gap: var(--spacing-m);
  }
</style>
