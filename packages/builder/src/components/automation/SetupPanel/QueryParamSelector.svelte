<script>
  import { createEventDispatcher } from "svelte"
  import { queries } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings

  $: query = $queries.list.find(query => query._id === value?.queryId)
  $: parameters = query?.parameters ?? []
</script>

<div class="block-field">
  <Select
    label="Query"
    value={value.queryId}
    on:change={e => {
      value = { queryId: e.detail }
      dispatch("change", value)
    }}
    options={$queries.list}
    getOptionValue={query => query._id}
    getOptionLabel={query => query.name}
  />
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
          dispatch("change", value)
        }}
        label={field.name}
        type="string"
        {bindings}
        fillWidth={true}
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
