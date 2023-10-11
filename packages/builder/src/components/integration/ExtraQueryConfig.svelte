<script>
  import { Select, Label, Input } from "@budibase/bbui"

  /**
   * This component takes the query object and populates the 'extra' property
   * when a datasource has specified a configuration for these fields in SCHEMA.extra
   */
  export let populateExtraQuery
  export let config
  export let query

  $: extraFields = Object.keys(config).map(key => ({
    ...config[key],
    key,
  }))

  $: extraQueryFields = query.fields.extra || {}
</script>

{#each extraFields as { key, displayName, type }}
  <Label>{displayName}</Label>
  {#if type === "string"}
    <Input
      on:change={() => populateExtraQuery(extraQueryFields)}
      bind:value={extraQueryFields[key]}
    />
  {/if}

  {#if type === "list"}
    <Select
      on:change={() => populateExtraQuery(extraQueryFields)}
      bind:value={extraQueryFields[key]}
      options={config[key].data[query.queryVerb]}
      getOptionLabel={current => current}
    />
  {/if}
{/each}
