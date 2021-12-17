<script>
  import {
    Divider,
    Heading,
    ActionButton,
    Badge,
    Body,
    Layout,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import RestAuthenticationBuilder from "./auth/RestAuthenticationBuilder.svelte"
  import ViewDynamicVariables from "./variables/ViewDynamicVariables.svelte"

  export let datasource
  export let queries

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
<RestAuthenticationBuilder bind:configs={datasource.config.authConfigs} />

<Divider size="S" />
<div class="section-header">
  <div class="badge">
    <Heading size="S">Variables</Heading>
    <Badge quiet grey>Optional</Badge>
  </div>
</div>
<Body size="S"
  >Variables enabled you to store and reuse values in queries. Static variables
  use constant values while dynamic values can be bound to the response headers
  or body of a query</Body
>
<Heading size="XS">Static</Heading>
<Layout noPadding gap="XS">
  <KeyValueBuilder
    name="Variable"
    keyPlaceholder="Name"
    headings
    bind:object={datasource.config.staticVariables}
    on:change
  />
</Layout>
<div />
<Heading size="XS">Dynamic</Heading>
<Body size="S">
  Dynamic variables are evaluated when a dependant query is executed. The value
  is cached for 24 hours and will re-evaluate if the dependendent query fails.
</Body>
<ViewDynamicVariables {queries} {datasource} />

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
