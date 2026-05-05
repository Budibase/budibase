<script lang="ts">
  import {
    SourceName,
    BodyType,
    type AutomationStep,
    type EnrichedBinding,
  } from "@budibase/types"
  import PropField from "../PropField.svelte"
  import { type AutomationContext } from "@/stores/builder/automations"
  import {
    Divider,
    Body,
    Button,
    Layout,
    DetailSummary,
    Icon,
    Modal,
  } from "@budibase/bbui"
  import { automationStore } from "@/stores/builder"
  import { type FormUpdate } from "@/types/automations"
  import { getInputValue } from "../layouts"
  import { queries, datasources } from "@/stores/builder"
  import ApiParamSelector from "./APIParamSelector.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { runtimeToReadableBinding, getAuthBindings } from "@/dataBinding"
  import { buildQueryBindings } from "@/components/integration/query"
  import { EditorModes } from "@/components/common/CodeEditor"
  import {
    urlParamHighlightPlugin,
    urlParamHighlightTheme,
  } from "@/components/common/CodeEditor/urlParamHighlight"
  import { customQueryIconColor } from "@/helpers/data/utils"
  import { applyBaseUrl } from "@budibase/shared-core"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import QuerySelect from "./QuerySelect.svelte"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"

  export let bindings: EnrichedBinding[] | undefined = undefined
  export let block: AutomationStep | undefined = undefined
  export let context: AutomationContext | undefined

  let value: any
  let authBindings: any[] = getAuthBindings()
  let selectedDatasourceId: string | undefined
  let modal: Modal
  let apiViewer: APIEndpointViewer | undefined

  $: addApiMode = !!$workspaceConnections.draft

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

  // The configured query
  $: query = $queries.list.find(query => query._id === value?.queryId)

  // QUERY DETAILS

  $: authId = query?.fields?.authConfigId
  $: auth = (dataSource?.config?.authConfigs || []).find(
    (auth: any) => auth._id === authId
  )

  // Parse the request for display — mirrors APIEndpointViewer's effectiveUrl logic
  $: datasourceBaseUrl = (dataSource as any)?.config?.url as string | undefined
  $: requestPath = query?.fields?.path
  $: displayBaseUrl = datasourceBaseUrl
    ? applyBaseUrl(requestPath ?? "", datasourceBaseUrl)
    : requestPath
  $: ({ mergedBindings: queryMergedBindings } = buildQueryBindings(
    dataSource,
    query
      ? Object.fromEntries(
          (query.parameters ?? []).map(p => [p.name, p.default])
        )
      : {},
    {}
  ))
  $: readableQueryString = runtimeToReadableBinding(
    queryMergedBindings,
    query?.fields?.queryString
  )
  $: effectiveUrl = readableQueryString
    ? `${displayBaseUrl}?${readableQueryString}`
    : displayBaseUrl
  $: verbColor = customQueryIconColor(query?.queryVerb)

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

  const defaultChange = (update: FormUpdate, block?: AutomationStep) => {
    if (block) {
      automationStore.actions.requestUpdate(update, block)
    }
  }

  const handleAddApi = () => {
    workspaceConnections.startDraft()
    modal.show()
  }

  const handleSavedQuery = (e: CustomEvent<{ queryId: string }>) => {
    defaultChange({ [fieldKey]: { queryId: e.detail.queryId } }, block)
    modal.hide()
  }

  const handleModalBeforeClose = async (): Promise<boolean> => {
    if (apiViewer) {
      const ok = await apiViewer.confirmIfDirty()
      if (!ok) return false
    }
    if (addApiMode) {
      workspaceConnections.discardDraft()
    }
    return true
  }
</script>

<div class="viewer-wrap">
  <!-- Possible Back to "origin" behaviour -->
  <Modal
    bind:this={modal}
    autoFocus={false}
    beforeClose={handleModalBeforeClose}
  >
    <div
      class="settings-dialog spectrum-Dialog spectrum-Dialog--extraLarge"
      style="position: relative;"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
    >
      <section class="spectrum-Dialog-content">
        <div class="endpoint-viewer-wrap">
          {#if addApiMode}
            <APIEndpointViewer
              bind:this={apiViewer}
              saveAndClose={true}
              settingsLocked={true}
              on:savedQuery={handleSavedQuery}
            />
          {:else}
            <APIEndpointViewer
              bind:this={apiViewer}
              datasourceId={dataSource?._id}
              queryId={query?._id}
              settingsLocked={true}
            />
          {/if}
        </div>
      </section>
    </div>
  </Modal>
</div>

<div class="step">
  {#if !restSources?.length}
    <div class="empty-rest">
      <Layout alignContent="center" gap="S">
        <Body size={"S"} textAlign="center">
          You currently have no REST APIs
        </Body>
        <div class="btn">
          <Button size={"S"} icon={"Add"} secondary on:click={handleAddApi}>
            Create
          </Button>
        </div>
      </Layout>
    </div>
  {:else}
    <QuerySelect
      value={value?.queryId}
      fullWidthDropdown
      onchange={q => defaultChange({ [fieldKey]: { queryId: q._id } }, block)}
      onaddApi={handleAddApi}
    />
    <div class="explorer-btn">
      <Button
        on:click={() => {
          modal.show()
        }}
      >
        Open API explorer
      </Button>
    </div>
    {#if value?.queryId}
      <ApiParamSelector
        {context}
        bindings={restBindings}
        {value}
        on:change={e => {
          defaultChange({ [fieldKey]: e.detail }, block)
        }}
      />
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
          <span class="embed url-embed" style:--verb-color={verbColor}>
            <CodeEditor
              value={effectiveUrl}
              mode={EditorModes.Handlebars}
              readonly
              readonlyLineNumbers={false}
              lineWrapping={true}
              extraExtensions={[
                urlParamHighlightPlugin,
                urlParamHighlightTheme,
              ]}
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
  .viewer-wrap {
    --settings-nav-transition-ms: 160ms;
    --settings-nav-transition-ease: cubic-bezier(0.22, 1, 0.36, 1);
    display: contents;
  }

  .spectrum-Dialog.spectrum-Dialog--extraLarge {
    width: 1150px;
    min-height: 720px;
    height: 720px;
  }

  .spectrum-Dialog-content {
    margin: 0px;
    padding: 0px;
    border-radius: var(--spectrum-global-dimension-size-100);
    width: 100%;
    height: 100%;
  }

  .spectrum-Dialog-content {
    display: flex;
    height: 100%;
  }

  .endpoint-viewer-wrap {
    --api-viewer-x-padding: 20px;
    --api-viewer-y-padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

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
  .url-embed :global(.cm-line .binding-wrap) {
    color: var(--verb-color) !important;
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
