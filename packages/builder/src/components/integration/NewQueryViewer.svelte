<script>
  import { goto } from "@roxi/routify"
  import { datasources, integrations, queries } from "stores/backend"
  import {
    Select,
    Input,
    Label,
    notifications,
    Heading,
    Body,
    Divider,
    Button,
  } from "@budibase/bbui"
  import { capitalise } from "helpers"
  import AccessLevelSelect from "./AccessLevelSelect.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import QueryViewerSidePanel from "./QueryViewerSidePanel/index.svelte"
  import { cloneDeep } from "lodash/fp"
  import BindingBuilder from "components/integration/QueryViewerBindingBuilder.svelte"
  import CodeMirrorEditor from "components/common/CodeMirrorEditor.svelte"
  import { ValidQueryNameRegex } from "@budibase/shared-core"
  import ExtraQueryConfig from "./ExtraQueryConfig.svelte"
  import QueryViewerSavePromptModal from "./QueryViewerSavePromptModal.svelte"
  import { Utils } from "@budibase/frontend-core"

  export let query
  let queryHash

  let loading = false
  let modified = false
  let valid = false
  let showSidePanel = false
  let nameError

  let newQuery

  let datasource
  let integration

  let responseRows = []
  let responseSchema = {}

  const parseQuery = query => {
    loading = false
    modified = false
    valid = false

    datasource = $datasources.list.find(ds => ds._id === query.datasourceId)
    integration = $integrations[datasource.source]
    const schemaType = integration.query[query.queryVerb].type

    newQuery = cloneDeep(query)
    // Set the location where the query code will be written to an empty string so that it doesn't
    // get changed from undefined -> "" by the input, breaking our unsaved changes checks
    newQuery.fields[schemaType] ??= ""

    queryHash = JSON.stringify(newQuery)
  }

  $: parseQuery(query)

  const checkIsModified = newQuery => {
    const newQueryHash = JSON.stringify(newQuery)
    modified = newQueryHash !== queryHash

    return modified
  }

  const debouncedCheckIsModified = Utils.debounce(checkIsModified, 1000)

  const markInvalid = () => {
    valid = false
  }

  $: debouncedCheckIsModified(newQuery)
  $: markInvalid(newQuery)

  async function runQuery({ suppressErrors = true }) {
    try {
      showSidePanel = true
      loading = true
      const response = await queries.preview(newQuery)
      if (response.rows.length === 0) {
        notifications.info(
          "Query results empty. Please execute a query with results to create your schema."
        )
        return
      }

      valid = true
      responseRows = response.rows
      responseSchema = { ...responseSchema, ...response.schema }
      notifications.success("Query executed successfully")
    } catch (error) {
      valid = false
      notifications.error(`Query Error: ${error.message}`)

      if (!suppressErrors) {
        throw error
      }
    } finally {
      loading = false
    }
  }

  async function saveQuery() {
    try {
      showSidePanel = true
      loading = true
      const response = await queries.save(newQuery.datasourceId, {
        ...newQuery,
        schema: responseSchema,
      })

      notifications.success("Query saved successfully")
      return response
    } catch (error) {
      valid = false
      notifications.error(error.message || "Error saving query")
    } finally {
      loading = false
    }
  }

  function resetDependentFields() {
    if (newQuery.fields.extra) {
      newQuery.fields.extra = {}
    }
  }

  function populateExtraQuery(extraQueryFields) {
    newQuery.fields.extra = extraQueryFields
  }
</script>

<QueryViewerSavePromptModal
  checkIsModified={() => checkIsModified(newQuery)}
  attemptSave={() => runQuery({ suppressErrors: false }).then(saveQuery)}
/>
<div class="queryViewer">
  <div class="main">
    <div class="header">
      <div class="title">
        <Body>
          {newQuery.name || "Untitled query"}<span class="unsaved"
            >{modified ? "*" : ""}</span
          >
        </Body>
      </div>
      <div class="controls">
        <Button
          disabled={loading}
          on:click={runQuery}
          overBackground
          icon="Play">Run query</Button
        >
        <Button
          on:click={async () => {
            const response = await saveQuery()

            // When creating a new query the initally passed in query object will have no id.
            if (response._id && !newQuery._id) {
              // Set the comparison query hash to match the new query so that the user doesn't
              // get nagged when navigating to the edit view
              queryHash = JSON.stringify(newQuery)
              $goto(`../../${response._id}`)
            }
          }}
          disabled={loading ||
            !valid ||
            !newQuery.name ||
            nameError ||
            responseRows.length === 0}
          overBackground
          icon="SaveFloppy"
        >
          Save
        </Button>
      </div>
    </div>

    <div class="body">
      <div class="bodyInner">
        <div class="config">
          <div class="config-field">
            <Label>Name</Label>
            <Input
              disabled={loading}
              value={newQuery.name}
              on:input={e => {
                let newValue = e.target.value || ""
                if (newValue.match(ValidQueryNameRegex)) {
                  newQuery.name = newValue.trim()
                  nameError = null
                } else {
                  nameError = "Invalid query name"
                }
              }}
              error={nameError}
            />
            {#if integration.query}
              <Label>Function</Label>
              <Select
                disabled={loading}
                bind:value={newQuery.queryVerb}
                on:change={resetDependentFields}
                options={Object.keys(integration.query)}
                getOptionLabel={verb =>
                  integration.query[verb]?.displayName || capitalise(verb)}
              />
              <Label>Access</Label>
              <AccessLevelSelect disabled={loading} query={newQuery} />
              {#if integration?.extra && newQuery.queryVerb}
                <ExtraQueryConfig
                  disabled={loading}
                  query={newQuery}
                  {populateExtraQuery}
                  config={integration.extra}
                />
              {/if}
            {/if}
          </div>
        </div>

        <Divider />

        <div class="config">
          <Heading size="S">Query</Heading>
          <Body size="S">Todo placeholder text</Body>
          <IntegrationQueryEditor
            disabled={loading}
            noLabel
            {datasource}
            bind:query={newQuery}
            height={200}
            schema={integration.query[newQuery.queryVerb]}
          />
        </div>
        <Divider />
        <div class="config">
          <Heading size="S">Bindings</Heading>
          {#key newQuery.parameters}
            <div class="binding-wrap">
              <BindingBuilder
                disabled={loading}
                hideHeading
                queryBindings={newQuery.parameters}
                bindable={false}
                on:change={e => {
                  newQuery.parameters = e.detail.map(binding => {
                    return {
                      name: binding.name,
                      default: binding.value,
                    }
                  })
                }}
              />
            </div>
          {/key}
        </div>
        <Divider />
        <div class="config">
          <div class="help-heading">
            <Heading size="S">Transformer</Heading>
          </div>
          <Body size="S">
            Add a JavaScript function to transform the query result.
          </Body>
          <CodeMirrorEditor
            disabled={loading}
            height={200}
            value={newQuery.transformer}
            resize="vertical"
            on:change={e => (newQuery.transformer = e.detail)}
          />
        </div>
      </div>
    </div>
  </div>

  <div class:showSidePanel class="sidePanel">
    <QueryViewerSidePanel
      onClose={() => (showSidePanel = false)}
      disabled={loading}
      onSchemaChange={newSchema => {
        console.log(newSchema)
        responseSchema = newSchema
      }}
      rows={responseRows}
      schema={responseSchema}
    />
  </div>
</div>

<style>
  .unsaved {
    color: var(--grey-5);
    font-style: italic;
  }

  .queryViewer {
    height: 100%;
    margin: -28px -40px -40px -40px;
    display: flex;
    flex: 1;
  }

  .queryViewer :global(.spectrum-Divider) {
    margin: 50px 0;
  }

  .main {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    align-items: center;
    padding: 10px 10px 10px 16px;
    display: flex;
  }

  .body {
    flex-grow: 1;
    overflow-y: scroll;
    padding: 23px 23px 80px;
    box-sizing: border-box;
  }

  .bodyInner {
    max-width: 600px;
    margin: auto;
  }

  .title {
    /* width 0 paired with flex-grow necessary here for the truncation to work properly*/
    width: 0;
    flex-grow: 1;
  }

  .title :global(p) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls {
    flex-shrink: 0;
  }

  .controls :global(button) {
    border: none;
    color: var(--grey-7);
    font-weight: 300;
  }

  .controls :global(button):hover {
    background-color: transparent;
    color: var(--ink);
  }

  .controls :global(.is-disabled) {
    pointer-events: none;
    background-color: transparent;
    color: var(--grey-3);
  }

  .config-field {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .sidePanel {
    height: 100%;
    width: 0;
    transition: width 150ms;
  }

  .sidePanel :global(.panel) {
    height: 100%;
  }

  .showSidePanel {
    width: 310px;
  }
</style>
