<script>
  import { beforeUrlChange, goto, params } from "@roxi/routify"
  import { datasources, flags, integrations, queries } from "@/stores/builder"

  import {
    Banner,
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Label,
    Layout,
    notifications,
    Select,
    Tab,
    Table,
    Tabs,
    TextArea,
  } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import EditableLabel from "@/components/common/inputs/EditableLabel.svelte"
  import CodeMirrorEditor, {
    EditorModes,
  } from "@/components/common/CodeMirrorEditor.svelte"
  import { capitalise, confirm } from "@/helpers"
  import { onMount } from "svelte"
  import JSONPreview from "@/components/integration/JSONPreview.svelte"
  import AccessLevelSelect from "@/components/integration/AccessLevelSelect.svelte"
  import { cloneDeep } from "lodash/fp"

  import {
    getRestBindings,
    readableToRuntimeBinding,
    readableToRuntimeMap,
    runtimeToReadableBinding,
    runtimeToReadableMap,
    toBindingsArray,
  } from "@/dataBinding"
  import ConnectedQueryScreens from "./ConnectedQueryScreens.svelte"

  export let queryId

  let query, datasource
  let requestBindings = {}
  let saveId
  let response, schema, enabledHeaders
  let restBindings = getRestBindings()
  let saving
  let queryNameLabel
  let mounted = false

  $: staticVariables = datasource?.config?.staticVariables || {}

  $: customRequestBindings = toBindingsArray(
    requestBindings,
    "Binding",
    "Bindings"
  )

  $: dataSourceStaticBindings = toBindingsArray(
    staticVariables,
    "Datasource.Static",
    "Datasource Static"
  )

  $: mergedBindings = [
    ...restBindings,
    ...customRequestBindings,
    ...dataSourceStaticBindings,
  ]

  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: responseSuccess = response?.info?.code >= 200 && response?.info?.code < 400
  $: schemaReadOnly = !responseSuccess
  $: hasSchema = Object.keys(schema || {}).length !== 0

  $: builtQuery = buildQuery(query, requestBindings)
  $: originalQuery = mounted
    ? (originalQuery ?? cloneDeep(builtQuery))
    : undefined
  $: isModified = JSON.stringify(originalQuery) !== JSON.stringify(builtQuery)

  function getSelectedQuery() {
    return cloneDeep(
      $queries.list.find(q => q._id === queryId) || {
        datasourceId: $params.datasourceId,
        parameters: [],
        fields: {
          query: "",
          variables: "",
          operationName: "",
        },
        queryVerb: "query",
      }
    )
  }

  function buildQuery(fromQuery, requestBindings) {
    if (!fromQuery) {
      return
    }
    const newQuery = cloneDeep(fromQuery)

    newQuery.parameters = Object.entries(requestBindings).map(([key, value]) => ({
      name: key,
      default: value,
    }))

    newQuery.fields.variables = 
      typeof newQuery.fields.variables === "object"
        ? readableToRuntimeMap(mergedBindings, newQuery.fields.variables)
        : readableToRuntimeBinding(mergedBindings, newQuery.fields.variables)

    newQuery.fields.query = readableToRuntimeBinding(mergedBindings, newQuery.fields.query)
    newQuery.fields.operationName = readableToRuntimeBinding(mergedBindings, newQuery.fields.operationName)
    newQuery.schema = schema || {}

    return newQuery
  }

  async function saveQuery(redirectIfNew = true) {
    const toSave = builtQuery
    saving = true
    try {
      const isNew = !query._rev
      const { _id } = await queries.save(toSave.datasourceId, toSave)
      saveId = _id

      notifications.success(`Query saved successfully`)
      if (isNew && redirectIfNew) {
        isModified = false
        $goto(`../../${_id}`)
      }

      query = getSelectedQuery()
      prettifyQueryRequestBody(
        query,
        requestBindings,
        staticVariables,
        restBindings
      )

      originalQuery = null
      queryNameLabel.disableEditingState()
      return { ok: true }
    } catch (err) {
      notifications.error(`Error saving query`)
    } finally {
      saving = false
    }

    return { ok: false }
  }

  const validateQuery = async () => {
    const forbiddenBindings = /{{\s?user(\.(\w|\$)*\s?|\s?)}}/g
    const bindingError = new Error(
      "'user' is a protected binding and cannot be used"
    )

    if (forbiddenBindings.test(query.fields.query ?? "")) {
      throw bindingError
    }

    if (forbiddenBindings.test(query.fields.variables ?? "")) {
      throw bindingError
    }

    if (forbiddenBindings.test(query.fields.operationName ?? "")) {
      throw bindingError
    }

    Object.values(requestBindings).forEach(bindingValue => {
      if (forbiddenBindings.test(bindingValue)) {
        throw bindingError
      }
    })
  }

  async function runQuery() {
    try {
      await validateQuery()
      response = await queries.preview(builtQuery)
      if (response.rows.length === 0) {
        notifications.info("Query did not return any data")
      } else {
        response.info = response.info || { code: 200 }
        if (schema) {
          for (let [name, field] of Object.entries(response.schema)) {
            if (!schema[name]) {
              schema[name] = field
            }
          }
        }
        schema = response.schema
        notifications.success("Query sent successfully")
      }
    } catch (error) {
      notifications.error(`Query Error: ${error.message}`)
    }
  }

  const prettifyQueryRequestBody = (
    query,
    requestBindings,
    staticVariables,
    restBindings
  ) => {
    let customRequestBindings = toBindingsArray(requestBindings, "Binding")
    let dataSourceStaticBindings = toBindingsArray(
      staticVariables,
      "Datasource.Static"
    )

    const prettyBindings = [
      ...restBindings,
      ...customRequestBindings,
      ...dataSourceStaticBindings,
    ]

    if (query?.fields?.query) {
      query.fields.query = runtimeToReadableBinding(prettyBindings, query.fields.query)
    }
    if (query?.fields?.variables) {
      query.fields.variables =
        typeof query.fields.variables === "object"
          ? runtimeToReadableMap(prettyBindings, query.fields.variables)
          : runtimeToReadableBinding(prettyBindings, query.fields.variables)
    }
    if (query?.fields?.operationName) {
      query.fields.operationName = runtimeToReadableBinding(prettyBindings, query.fields.operationName)
    }
  }

  onMount(async () => {
    query = getSelectedQuery()
    schema = query.schema

    try {
      await datasources.init()
    } catch (error) {
      notifications.error("Error getting datasources")
    }

    datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
    
    if (!query.fields.query) {
      query.fields.query = ""
    }
    if (!query.fields.variables) {
      query.fields.variables = ""
    }
    if (!query.fields.operationName) {
      query.fields.operationName = ""
    }

    if (query && !query.transformer) {
      query.transformer = "return data"
    }
    if (query && !query.flags) {
      query.flags = {
        urlName: false,
      }
    }

    prettifyQueryRequestBody(
      query,
      requestBindings,
      staticVariables,
      restBindings
    )

    mounted = true
  })

  $beforeUrlChange(async () => {
    if (!isModified) {
      return true
    }

    return await confirm({
      title: "Some updates are not saved",
      body: "Some of your changes are not yet saved. Do you want to save them before leaving?",
      okText: "Save and continue",
      cancelText: "Discard and continue",
      size: "M",
      onConfirm: async () => {
        const saveResult = await saveQuery(false)
        if (!saveResult.ok) {
          return false
        }
        return true
      },
      onCancel: () => {
        return true
      },
      onClose: () => {
        return false
      },
    })
  })
</script>

{#if query && queryConfig}
  <div class="inner">
    <div class="top">
      <Layout gap="S">
        <div class="top-bar">
          <EditableLabel
            bind:this={queryNameLabel}
            type="heading"
            bind:value={query.name}
            defaultValue="Untitled"
            on:change={() => (query.flags.urlName = false)}
            on:save={saveQuery}
          />
          <div class="controls">
            {#if query._id}
              <ConnectedQueryScreens sourceId={query._id} />
            {/if}
            <div class="access">
              <Label>Access</Label>
              <AccessLevelSelect {query} {saveId} />
            </div>
          </div>
        </div>
        <div class="url-block">
          <div class="verb">
            <Select
              bind:value={query.queryVerb}
              on:change={() => {}}
              options={Object.keys(queryConfig)}
              getOptionLabel={verb =>
                queryConfig[verb]?.displayName || capitalise(verb)}
            />
          </div>
          <Button primary disabled={!query.fields.query} on:click={runQuery}>Send</Button>
          <Button
            disabled={!query.name || !isModified || saving}
            cta
            on:click={saveQuery}
            tooltip={!hasSchema
              ? "Saving a query before sending will mean no schema is generated"
              : null}
            >Save
          </Button>
        </div>
        <Tabs selected="Query" quiet noPadding noHorizPadding onTop>
          <Tab title="Query">
            <div class="query-section">
              <Label>GraphQL Query</Label>
              <CodeMirrorEditor
                bind:value={query.fields.query}
                mode={EditorModes.JavaScript}
                height={300}
                placeholder="Enter your GraphQL query here..."
              />
            </div>
          </Tab>
          <Tab title="Variables">
            <div class="variables-section">
              <Label>Variables (JSON)</Label>
              <CodeMirrorEditor
                bind:value={query.fields.variables}
                mode={EditorModes.JSON}
                height={200}
                placeholder="{`{\"key\": \"value\"}`}"
              />
            </div>
          </Tab>
          <Tab title="Operation">
            <div class="operation-section">
              <Label>Operation Name</Label>
              <Input
                bind:value={query.fields.operationName}
                placeholder="Optional operation name"
              />
            </div>
          </Tab>
          <Tab title="Bindings">
            <KeyValueBuilder
              bind:object={requestBindings}
              tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
              name="binding"
              headings
              keyPlaceholder="Binding name"
              valuePlaceholder="Default"
              bindings={mergedBindings}
            />
          </Tab>
          <Tab title="Transformer">
            <div class="transformer-section">
              <Label>Transformer</Label>
              <CodeMirrorEditor
                bind:value={query.transformer}
                mode={EditorModes.JavaScript}
                height={200}
                placeholder="return data"
              />
            </div>
          </Tab>
        </Tabs>
      </Layout>
    </div>

    <div class="bottom">
      <Tabs selected="JSON" quiet>
        <Tab title="JSON">
          <JSONPreview height="300" data={response?.data} />
        </Tab>
        <Tab title="Schema">
          <JSONPreview height="300" data={schema} />
        </Tab>
        <Tab title="Raw">
          <JSONPreview height="300" data={response?.extra?.raw} />
        </Tab>
        <Tab title="Headers">
          <JSONPreview height="300" data={response?.extra?.headers} />
        </Tab>
      </Tabs>
    </div>
  </div>
{/if}

<style>
  .inner {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .top {
    flex: 1;
    min-height: 0;
    padding: 24px;
  }

  .bottom {
    flex: 1;
    min-height: 0;
    border-top: var(--border-light);
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .access {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .url-block {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .verb {
    flex: 0 0 120px;
  }

  .query-section,
  .variables-section,
  .operation-section,
  .transformer-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
  }
</style>
