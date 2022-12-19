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
  import {
    getRestBindings,
    readableToRuntimeBinding,
    runtimeToReadableMap,
  } from "builderStore/dataBinding"
  import { cloneDeep } from "lodash/fp"

  export let datasource
  export let queries

  let addHeader

  let parsedHeaders = runtimeToReadableMap(
    getRestBindings(),
    cloneDeep(datasource?.config?.defaultHeaders)
  )

  const onDefaultHeaderUpdate = headers => {
    const flatHeaders = cloneDeep(headers).reduce((acc, entry) => {
      acc[entry.name] = readableToRuntimeBinding(getRestBindings(), entry.value)
      return acc
    }, {})

    datasource.config.defaultHeaders = flatHeaders
  }
</script>

<Divider />
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
  bind:object={parsedHeaders}
  on:change={evt => onDefaultHeaderUpdate(evt.detail)}
  noAddButton
  bindings={getRestBindings()}
/>
<div>
  <ActionButton icon="Add" on:click={() => addHeader.addEntry()}>
    Add header
  </ActionButton>
</div>

<Divider />
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

<Divider />
<div class="section-header">
  <div class="badge">
    <Heading size="S">Variables</Heading>
    <Badge quiet grey>Optional</Badge>
  </div>
</div>
<Body size="S"
  >Variables enable you to store and re-use values in queries, with the choice
  of a static value such as a token using static variables, or a value from a
  query response using dynamic variables.</Body
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
  is cached for a period of time and will be refreshed if a query fails.
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
