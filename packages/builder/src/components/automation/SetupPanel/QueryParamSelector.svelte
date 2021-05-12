<script>
  import { queries } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"

  export let value
  export let bindings

  $: query = $queries.list.find(query => query._id === value?.queryId)
  $: parameters = query?.parameters ?? []

  // Ensure any nullish queryId values get set to empty string so
  // that the select works
  $: if (value?.queryId == null) value = { queryId: "" }
</script>

<div class="block-field">
  <Select bind:value={value.queryId} extraThin secondary>
    <option value="">Choose an option</option>
    {#each $queries.list as query}
      <option value={query._id}>{query.name}</option>
    {/each}
  </Select>
</div>

{#if parameters.length}
  <div class="schema-fields">
    {#each parameters as field}
      <DrawerBindableInput
        panel={AutomationBindingPanel}
        extraThin
        value={value[field.name]}
        on:change={e => {
          value[field.name] = e.detail
        }}
        label={field.name}
        type="string"
        {bindings}
      />
    {/each}
  </div>
{/if}

<style>
  .schema-fields {
    display: grid;
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
  .schema-fields :global(label) {
    text-transform: capitalize;
  }
</style>
