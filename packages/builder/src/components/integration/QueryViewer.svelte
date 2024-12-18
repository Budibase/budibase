<script>
  import { goto } from "@roxi/routify"
  import { datasources, integrations, queries } from "@/stores/builder"
  import {
    Icon,
    Select,
    Input,
    Label,
    notifications,
    Heading,
    Body,
    Divider,
    Button,
  } from "@budibase/bbui"
  import { capitalise } from "@/helpers"
  import AccessLevelSelect from "./AccessLevelSelect.svelte"
  import IntegrationQueryEditor from "@/components/integration/index.svelte"
  import QueryViewerSidePanel from "./QueryViewerSidePanel/index.svelte"
  import { cloneDeep } from "lodash/fp"
  import BindingBuilder from "@/components/integration/QueryViewerBindingBuilder.svelte"
  import CodeMirrorEditor from "@/components/common/CodeMirrorEditor.svelte"
  import { ValidQueryNameRegex } from "@budibase/shared-core"
  import ExtraQueryConfig from "./ExtraQueryConfig.svelte"
  import QueryViewerSavePromptModal from "./QueryViewerSavePromptModal.svelte"
  import { Utils } from "@budibase/frontend-core"

  export let query
  let queryHash

  let loading = false
  let modified = false
  let scrolling = false
  let showSidePanel = false
  let nameError

  let newQuery

  let datasource
  let integration
  let schemaType

  let schema = {}
  let nestedSchemaFields = {}
  let rows = []
  let keys = {}

  const parseQuery = query => {
    modified = false

    datasource = $datasources.list.find(ds => ds._id === query.datasourceId)
    integration = $integrations[datasource.source]
    schemaType = integration.query[query.queryVerb].type

    newQuery = cloneDeep(query)
    // init schema from the query if one already exists
    schema = newQuery.schema
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

  $: debouncedCheckIsModified(newQuery)

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

      nestedSchemaFields = response.nestedSchemaFields

      schema = response.schema
      rows = response.rows

      notifications.success("Query executed successfully")
    } catch (error) {
      if (typeof error.message === "string") {
        notifications.error(`Query Error: ${error.message}`)
      } else if (typeof error.message?.code === "string") {
        notifications.error(`Query Error: ${error.message.code}`)
      } else {
        notifications.error(`Query Error: ${JSON.stringify(error.message)}`)
      }

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
        schema,
        nestedSchemaFields,
      })

      notifications.success("Query saved successfully")
      return response
    } catch (error) {
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

  const handleScroll = e => {
    scrolling = e.target.scrollTop !== 0
  }

  async function handleKeyDown(evt) {
    keys[evt.key] = true
    if ((keys["Meta"] || keys["Control"]) && keys["Enter"]) {
      await runQuery({ suppressErrors: false })
    }
  }

  function handleKeyUp(evt) {
    delete keys[evt.key]
  }
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<QueryViewerSavePromptModal
  checkIsModified={() => checkIsModified(newQuery)}
  attemptSave={() => runQuery({ suppressErrors: false }).then(saveQuery)}
/>
<div class="queryViewer">
  <div class="main">
    <div class="header" class:scrolling>
      <div class="title">
        <Body size="S">
          {newQuery.name || "Untitled query"}<span class="unsaved"
            >{modified ? "*" : ""}</span
          >
        </Body>
      </div>
      <div class="controls">
        <Button disabled={loading} on:click={runQuery} overBackground>
          <Icon size="S" name="Play" />
          Run query</Button
        >
        <div class="tooltip" title="Run your query to enable saving">
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
              !newQuery.name ||
              nameError ||
              rows.length === 0}
            overBackground
          >
            <Icon size="S" name="SaveFloppy" />
            Save
          </Button>
        </div>
      </div>
    </div>

    <div class="body" on:scroll={handleScroll}>
      <div class="bodyInner">
        <div class="configField">
          <Label>Name</Label>
          <Input
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
              bind:value={newQuery.queryVerb}
              on:change={resetDependentFields}
              options={Object.keys(integration.query)}
              getOptionLabel={verb =>
                integration.query[verb]?.displayName || capitalise(verb)}
            />
            <Label>Access</Label>
            <AccessLevelSelect query={newQuery} />
            {#if integration?.extra && newQuery.queryVerb}
              <ExtraQueryConfig
                query={newQuery}
                {populateExtraQuery}
                config={integration.extra}
              />
            {/if}
          {/if}
        </div>

        <Divider />

        <div class="heading">
          <Heading weight="L" size="XS">Query</Heading>
        </div>
        <div class="copy">
          <Body size="S">
            {#if schemaType === "sql"}
              Add some SQL to query your data
            {:else if schemaType === "json"}
              Add some JSON to query your data
            {:else if schemaType === "fields"}
              Add some fields to query your data
            {:else}
              Enter your query below
            {/if}
          </Body>
        </div>
        <IntegrationQueryEditor
          noLabel
          {datasource}
          bind:query={newQuery}
          height={200}
          schema={integration.query[newQuery.queryVerb]}
        />

        <Divider />

        <div class="heading">
          <Heading weight="L" size="XS">Bindings</Heading>
        </div>
        <div class="copy">
          <Body size="S">
            Bindings come in two parts: the binding name, and a default/fallback
            value. These bindings can be used as Handlebars expressions
            throughout the query.
          </Body>
        </div>
        {#key newQuery.parameters}
          <BindingBuilder
            hideHeading
            queryBindings={newQuery.parameters}
            on:change={e => {
              newQuery.parameters = e.detail.map(binding => {
                return {
                  name: binding.name,
                  default: binding.value,
                }
              })
            }}
          />
        {/key}

        <Divider />
        <div class="heading">
          <Heading weight="L" size="XS">Transformer</Heading>
        </div>
        <div class="copy">
          <Body size="S">
            Add a JavaScript function to transform the query result.
          </Body>
        </div>
        <CodeMirrorEditor
          height={200}
          value={newQuery.transformer}
          resize="vertical"
          on:change={e => (newQuery.transformer = e.detail)}
        />
      </div>
    </div>
  </div>

  <div class:showSidePanel class="sidePanel">
    <QueryViewerSidePanel
      onClose={() => (showSidePanel = false)}
      onSchemaChange={newSchema => {
        schema = newSchema
      }}
      {rows}
      {schema}
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
    margin: 35px 0;
  }

  .main {
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    align-items: center;
    padding: 8px 10px 8px 16px;
    display: flex;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out, background 130ms ease-out;
  }

  .header.scrolling {
    border-bottom: var(--border-light);
    background: var(--background);
  }

  .body {
    flex-grow: 1;
    overflow-y: scroll;
    padding: 23px 23px 80px;
    box-sizing: border-box;
  }

  .bodyInner {
    max-width: 520px;
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

  .tooltip {
    display: inline-block;
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

  .controls :global(span) {
    display: flex;
    align-items: center;
  }

  .controls :global(.icon) {
    margin-right: 8px;
  }

  .configField {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .configField :global(label) {
    color: var(--grey-6);
  }

  .heading {
    margin-bottom: 8px;
  }

  .copy {
    margin-bottom: 14px;
  }

  .copy :global(p) {
    color: var(--grey-7);
  }

  .sidePanel {
    flex-shrink: 0;
    height: 100%;
    width: 0;
    overflow: hidden;
    transition: width 150ms;
  }

  .sidePanel :global(.panel) {
    height: 100%;
  }

  .showSidePanel {
    width: 450px;
  }
</style>
