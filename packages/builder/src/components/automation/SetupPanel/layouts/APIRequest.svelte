<script lang="ts">
  import {
    SourceName,
    BodyType,
    type AutomationStep,
    type EnrichedBinding,
    type Query,
  } from "@budibase/types"
  import PropField from "../PropField.svelte"
  import { type AutomationContext } from "@/stores/builder/automations"
  import {
    Divider,
    Body,
    Button,
    Layout,
    notifications,
    Select,
    DetailSummary,
    Icon,
  } from "@budibase/bbui"
  import {
    automationStore,
    sortedIntegrations as integrations,
  } from "@/stores/builder"
  import { type FormUpdate } from "@/types/automations"
  import { getInputValue } from "../layouts"
  import { queries, datasources } from "@/stores/builder"
  import ApiParamSelector from "./APIParamSelector.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { runtimeToReadableBinding, getAuthBindings } from "@/dataBinding"
  import { EditorModes } from "@/components/common/CodeEditor"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { configFromIntegration } from "@/stores/selectors"
  import { goto, params } from "@roxi/routify"

  export let bindings: EnrichedBinding[] | undefined = undefined
  export let block: AutomationStep | undefined = undefined
  export let context: AutomationContext | undefined

  let value: any
  let authBindings: any[] = getAuthBindings()
  let selectedDatasourceId: string | undefined

  // Include any custom bindings from the REST API data section UI to ensure completeness
  // when parsing to readable
  $: restBindings = [...(bindings || []), ...authBindings]

  // The step input properties
  $: inputData = automationStore.actions.getInputData(block)
  $: fieldKey = "query"
  $: {
    value = getInputValue(inputData, fieldKey)
  }
  $: if (value) {
    selectedDatasourceId = undefined
  }

  // Include only REST API sources
  $: restSources = $datasources?.list?.filter(d => d.source === SourceName.REST)

  $: targetSource = selectedDatasourceId || query?.datasourceId

  // Source for current query, if any
  $: dataSource =
    restSources?.find(ds => ds._id === targetSource) || restSources?.[0]

  $: restQueries = dataSource
    ? $queries.list.filter(q => {
        return q.datasourceId === dataSource._id
      })
    : []

  // The configured query
  $: query = $queries.list.find(query => query._id === value?.queryId)

  // QUERY DETAILS

  $: authId = query?.fields?.authConfigId
  $: auth = (dataSource?.config?.authConfigs || []).find(
    (auth: any) => auth._id === authId
  )

  // Parse the request for display
  $: requestPreview = getRESTPreview(query)
  $: readablePreview = runtimeToReadableBinding(restBindings, requestPreview)

  // Parse the bindings of the request body when present.
  $: readableBody = parseBody(query?.fields?.requestBody)

  // Show only enabled headers and make any bindings readable
  $: queryHeaders = query?.fields?.headers
  $: parsedHeaderEntries = Object.entries(queryHeaders || {})
    .filter(([key]: [string, string]) => {
      return !query?.fields?.disabledHeaders?.[key]
    })
    .map(([key, val]: [string, string]) => {
      return [key, runtimeToReadableBinding(restBindings, val)]
    })
  $: parsedHeaders = Object.fromEntries(parsedHeaderEntries)

  const parseBody = (body: any) => {
    if (query?.fields?.bodyType === BodyType.NONE) {
      return null
    }

    const bodyString = typeof body === "string" ? body : JSON.stringify(body)
    return runtimeToReadableBinding(restBindings, bodyString)
  }

  const getRESTPreview = (query: Query | undefined) => {
    if (!query) return
    return query?.fields?.queryString
      ? `${query?.fields?.path}?${query?.fields?.queryString}`
      : query?.fields?.path
  }

  const defaultChange = (update: FormUpdate, block?: AutomationStep) => {
    if (block) {
      automationStore.actions.requestUpdate(update, block)
    }
  }
</script>

<div class="step">
  {#if !restSources?.length}
    <div class="empty-rest">
      <Layout alignContent="center" gap="S">
        <Body size={"S"} textAlign="center">
          You currently have no REST APIs
        </Body>
        <div class="btn">
          <Button
            size={"S"}
            icon={"Add"}
            secondary
            on:click={() => {
              const REST = $integrations.find(i => i.name === SourceName.REST)
              if (!REST) {
                notifications.error("Could not create REST API!")
                return
              }

              datasources
                .create({
                  integration: REST,
                  config: configFromIntegration(REST),
                })
                .then(datasource => {
                  notifications.success("REST API created successfully")
                  $goto(`/builder/workspace/:application/data/query/new/:id`, {
                    application: $params.application,
                    id: datasource._id,
                  })
                })
                .catch(err => {
                  notifications.error("")
                  console.error("REST API create failed", err)
                })
            }}
          >
            Create
          </Button>
        </div>
      </Layout>
    </div>
  {:else}
    <PropField label={"REST API*"} fullWidth>
      <Select
        placeholder={false}
        options={restSources.map(r => ({ label: r.name, value: r._id }))}
        value={dataSource._id}
        on:change={e => {
          selectedDatasourceId = e.detail

          if (query?.datasourceId !== selectedDatasourceId) {
            defaultChange({ [fieldKey]: null }, block)
          }
        }}
      />
    </PropField>
    {#if restQueries?.length}
      <PropField label={"Request*"} fullWidth>
        <ApiParamSelector
          {context}
          bindings={restBindings}
          {value}
          {dataSource}
          on:change={e => {
            defaultChange({ [fieldKey]: e.detail }, block)
          }}
        />
      </PropField>
    {:else}
      <div class="empty-rest">
        <Layout alignContent="center" gap="S">
          <Body size={"S"} textAlign="center">
            You don't currently have any REST requests
          </Body>
          <div class="btn">
            <Button
              size={"S"}
              icon={"Add"}
              secondary
              on:click={() => {
                $goto(`/builder/workspace/:application/data/query/new/:id`, {
                  application: $params.application,
                  id: dataSource._id,
                })
              }}
            >
              Create
            </Button>
          </div>
        </Layout>
      </div>
    {/if}
  {/if}

  {#if query}
    <Divider noMargin />
    <DetailSummary name="Request details" padded={false} initiallyShow>
      <div class="info">
        {#if auth}
          <span class="auth-wrap">
            <PropField label={`Auth: ${auth.type.toUpperCase()}`} fullWidth>
              <div class="auth">
                <Icon name="LockClosed" />
                <div class="auth-details">{auth.name}</div>
              </div>
            </PropField>
          </span>
        {/if}
        <PropField label={"Request URL"} fullWidth>
          <span class="embed">
            <CodeEditor
              value={readablePreview}
              readonly
              readonlyLineNumbers={false}
            />
          </span>
        </PropField>
        {#if parsedHeaderEntries.length}
          {#key parsedHeaderEntries}
            <span class="kvp">
              <PropField label="Headers" fullWidth>
                <KeyValueBuilder noAddButton object={parsedHeaders} readOnly />
              </PropField>
            </span>
          {/key}
        {/if}
        {#if readableBody}
          <span class="embed">
            <PropField
              label={`Body: ${query.fields.bodyType?.toUpperCase()}`}
              fullWidth
            >
              <CodeEditor
                value={readableBody}
                readonly
                readonlyLineNumbers={false}
              />
            </PropField>
          </span>
        {/if}
        <PropField label={"Transformer"} fullWidth>
          <span class="embed">
            <CodeEditor
              value={query?.transformer}
              mode={EditorModes.JS}
              readonly
              readonlyLineNumbers={false}
            />
          </span>
        </PropField>
      </div>
    </DetailSummary>
  {/if}
</div>

<style>
  .step {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding-bottom: var(--spacing-xl);
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .embed :global(.cm-editor) {
    color: var(--spectrum-global-color-gray-800);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-xs);
  }
  .auth {
    display: flex;
    gap: var(--spacing-s);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-50);
    padding: var(--spacing-s);
    align-items: center;
  }
  .embed :global(.cm-editor .cm-content .cm-line) {
    tab-size: 1;
  }
  .btn {
    display: flex;
    justify-content: center;
  }
  .btn :global(.spectrum-Button-label) {
    line-height: 1em;
  }
  .kvp :global(.container) {
    margin: 0px;
  }
</style>
