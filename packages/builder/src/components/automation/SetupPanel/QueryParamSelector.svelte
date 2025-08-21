<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { queries, datasources } from "@/stores/builder"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import PropField from "./PropField.svelte"
  import {
    type EnrichedBinding,
    type ExecuteQueryStepInputs,
    type Query,
    type QueryParameter,
    SourceName,
  } from "@budibase/types"
  import { type AutomationContext } from "@/stores/builder/automations"

  const dispatch = createEventDispatcher()

  export let value: Partial<ExecuteQueryStepInputs["query"]> | undefined =
    undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let context: AutomationContext | undefined

  const onChangeQuery = (e: CustomEvent) => {
    if (!value) value = {}
    value.queryId = e.detail
    dispatch("change", value)
  }

  const onChange = (e: CustomEvent, field: QueryParameter) => {
    if (!value) value = {}
    value[field.name] = e.detail
    dispatch("change", value)
  }

  $: query = $queries.list.find(query => query._id === value?.queryId)
  $: parameters = query?.parameters ?? []
  $: queryOptions = getQueryOptions($queries.list, query?._id)

  // Get all queries except REST
  const getQueryOptions = (
    queries: Query[],
    selectedQueryId: string | undefined
  ) => {
    return queries.reduce<Query[]>((acc, q) => {
      const datasource = $datasources?.list?.find(
        ds => ds._id === q?.datasourceId
      )
      // If a rest query is already selected, allow it to stay
      if (
        datasource?.source !== SourceName.REST ||
        (selectedQueryId && q._id === selectedQueryId)
      ) {
        acc.push(q)
      }
      return acc
    }, [])
  }

  // Ensure any nullish queryId values get set to empty string so
  // that the select works
  $: if (value?.queryId == null) value = { queryId: "" }
</script>

<div class="schema-field">
  <div class="field-width">
    <Select
      on:change={onChangeQuery}
      value={value?.queryId}
      options={queryOptions}
      getOptionValue={query => query._id}
      getOptionLabel={query => query.name}
    />
  </div>
</div>

{#if parameters.length}
  <span class="request-props">
    {#each parameters as field}
      <PropField label={field.name} fullWidth>
        <DrawerBindableInput
          {context}
          panel={AutomationBindingPanel}
          value={value?.[field.name]}
          on:change={e => onChange(e, field)}
          {bindings}
          updateOnChange={false}
        />
      </PropField>
    {/each}
  </span>
{/if}

<style>
  .request-props {
    padding-top: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .field-width {
    width: 100%;
  }

  .schema-field :global(label) {
    text-transform: capitalize;
  }
</style>
