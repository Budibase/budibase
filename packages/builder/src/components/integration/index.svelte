<script>
  import { TextArea, Label, Input, Heading } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"

  const CAPTURE_VAR_INSIDE_MUSTACHE = /{{([^}]+)}}/g

  const QueryTypes = {
    SQL: "sql",
  }

  export let query

  // TODO: bind these to the query
  let parameters = []

  $: query.parameters = parameters.reduce(
    (acc, next) => ({ [next.key]: next.value, ...acc }),
    {}
  )

  function newQueryParameter() {
    parameters = [...parameters, {}]
  }

  function deleteQueryParameter(idx) {
    parameters.splice(idx, 1)
    parameters = parameters
  }
</script>

<Heading extraSmall black>Parameters</Heading>

{#if query.queryType === QueryTypes.SQL}
  <section>
    <div class="parameters">
      <Label extraSmall grey>Parameter Name</Label>
      <Label extraSmall grey>Default Value</Label>
      <!-- CLEAR ALL PARAMS OR SOMETHING -->
      <i class="ri-close-circle-line delete" on:click={console.log} />
      {#each parameters as parameter, idx}
        <Input thin bind:value={parameter.key} />
        <Input thin bind:value={parameter.value} />
        <i
          class="ri-close-circle-line delete"
          on:click={() => deleteQueryParameter(idx)} />
      {/each}
      <i class="ri-add-circle-line" on:click={newQueryParameter} />
    </div>
  </section>

  <Editor label="Query" bind:value={query.queryString} />
{/if}

<style>
  .parameters {
    display: grid;
    grid-template-columns: 1fr 1fr 5%;
    grid-gap: 10px;
    align-items: center;
  }

  section {
    margin-bottom: var(--spacing-xl);
  }
</style>
