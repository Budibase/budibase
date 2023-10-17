<script>
  import { createEventDispatcher } from "svelte"
  import { queries } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings

  const onChangeQuery = e => {
    value.queryId = e.detail
    dispatch("change", value)
  }

  const onChange = (e, field) => {
    value[field.name] = e.detail
    dispatch("change", value)
  }

  $: query = $queries.list.find(query => query._id === value?.queryId)
  $: parameters = query?.parameters ?? []
  // Ensure any nullish queryId values get set to empty string so
  // that the select works
  $: if (value?.queryId == null) value = { queryId: "" }
</script>

<div class="block-field">
  <Select
    label="Query"
    on:change={onChangeQuery}
    value={value.queryId}
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
        on:change={e => onChange(e, field)}
        label={field.name}
        type="string"
        {bindings}
        fillWidth={true}
        updateOnChange={false}
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
