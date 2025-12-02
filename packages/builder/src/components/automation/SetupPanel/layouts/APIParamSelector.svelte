<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { queries, datasources } from "@/stores/builder"
  import { Select, ActionButton, DetailSummary, Divider } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import PropField from "../PropField.svelte"
  import {
    type APIRequestStepInputs,
    type Datasource,
    type EnrichedBinding,
    type Query,
    type QueryParameter,
    type UIInternalDatasource,
    SourceName,
  } from "@budibase/types"
  import {
    customQueryIconColor,
    customQueryIconText,
  } from "@/helpers/data/utils"
  import QueryVerbBadge from "@/components/common/QueryVerbBadge.svelte"
  import { goto, params } from "@roxi/routify"
  import { type AutomationContext } from "@/stores/builder/automations"
  import { runtimeToReadableBinding } from "@/dataBinding"

  $goto
  $params

  const dispatch = createEventDispatcher()

  type QueryWithIcon = Query & {
    icon?: {
      component: typeof QueryVerbBadge
      props: { verb?: string; color?: string }
    }
  }

  export let value: Partial<APIRequestStepInputs["query"]> | undefined =
    undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let context: AutomationContext | undefined = undefined
  export let dataSource: Datasource | UIInternalDatasource | undefined =
    undefined

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

  $: parameters = query?.parameters ?? []

  // Selected query and source
  $: query = $queries.list.find(query => query._id === value?.queryId)
  $: queryDataSource =
    $datasources?.list?.find(ds => ds._id === query?.datasourceId) || dataSource
  $: filtered = $queries.list.filter(
    q =>
      q?.datasourceId === queryDataSource?._id &&
      queryDataSource?.source === SourceName.REST
  )

  $: queryOptions = getQueryOptions(filtered)

  const getQueryOptions = (queries: Query[]): QueryWithIcon[] => {
    return queries.reduce<QueryWithIcon[]>((acc, q) => {
      const verb = customQueryIconText(q)
      const color = customQueryIconColor(q)
      acc.push({
        ...q,
        icon: verb
          ? {
              component: QueryVerbBadge,
              props: { verb, color },
            }
          : undefined,
      })
      return acc
    }, [])
  }

  const getFieldDefault = (name: string) => {
    if (!query?.fields) {
      return
    }
    const field = query?.parameters?.find(f => f.name === name)
    return runtimeToReadableBinding(bindings, field?.default)
  }
</script>

<div class="wrap">
  <div class="picker">
    <Select
      on:change={onChangeQuery}
      value={value?.queryId}
      options={queryOptions}
      getOptionValue={query => query._id}
      getOptionLabel={query => query.name}
    />

    <ActionButton
      icon="Add"
      disabled={!queryDataSource?._id}
      on:click={() => {
        $goto(`/builder/workspace/:application/apis/query/new/:id`, {
          application: $params.application,
          id: queryDataSource?._id,
        })
      }}
    />
  </div>

  {#if parameters.length}
    <Divider noMargin />
    <DetailSummary name="Bindings" padded={false} initiallyShow>
      <span class="request-props">
        <div>
          Override your query bindings below. If no overrides are added, binding
          defaults will be used.
        </div>
        {#each parameters as field}
          <PropField label={field.name} fullWidth>
            <DrawerBindableInput
              placeholder={getFieldDefault(field.name)}
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
    </DetailSummary>
  {/if}
</div>

<style>
  .picker {
    display: flex;
    gap: var(--spacing-s);
  }
  .picker :global(.spectrum-Form-item) {
    flex: 1;
  }
  .wrap,
  .request-props {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .wrap :global(label) {
    text-transform: capitalize;
  }

  .wrap :global(.option-extra img.icon-dims),
  :global(.popover-content .option-extra img.icon-dims) {
    width: 30px;
  }
</style>
