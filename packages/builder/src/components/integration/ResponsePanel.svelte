<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import {
    Layout,
    Tabs,
    Tab,
    Label,
    Body,
    Select,
    CoreTextArea,
  } from "@budibase/bbui"
  import type {
    Datasource,
    PreviewQueryResponse,
    QuerySchema,
    UIInternalDatasource,
  } from "@budibase/types"
  import { shouldShowVariables, keyValueArrayToRecord } from "./query"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"
  import { SchemaTypeOptionsExpanded } from "@/constants/backend"
  import DynamicVariableModal from "./DynamicVariableModal.svelte"
  import CodeEditor from "../common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "../common/CodeEditor"

  export let response: PreviewQueryResponse | undefined = undefined
  export let schema: Record<string, QuerySchema | string> | undefined =
    undefined
  export let datasource: Datasource | UIInternalDatasource | undefined
  export let dynamicVariables: Record<string, string>
  export let fullscreen = false

  const dispatch = createEventDispatcher()

  let varBinding: string
  let addVariableModal: DynamicVariableModal
  let selectedTab: string | undefined

  // Build tab options dynamically
  $: tabOptions = [
    ...(response
      ? [
          { label: "JSON", value: "JSON" },
          { label: "Raw", value: "Raw" },
          { label: "Headers", value: "Headers" },
        ]
      : []),
    ...(schema || response ? [{ label: "Schema", value: "Schema" }] : []),
    ...(showVariables
      ? [{ label: "Dynamic Variables", value: "Dynamic Variables" }]
      : []),
  ]

  // RESPONSE
  $: responseSuccess =
    !!response && response.info.code >= 200 && response.info.code < 400
  $: showVariables = shouldShowVariables(dynamicVariables, responseSuccess)

  // Set default selected tab
  $: if (selectedTab === undefined && tabOptions.length > 0) {
    selectedTab = response ? "JSON" : "Schema"
  }

  // Switch to JSON tab whenever response changes
  $: if (response) {
    selectedTab = "JSON"
  }

  const handleTabChange = (e: CustomEvent<string>) => {
    selectedTab = e.detail
  }

  const schemaMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: (input: { name: string; value: string }) => {
        varBinding = `{{ data.0.[${input.name}] }}`
        addVariableModal.show()
      },
    },
  ]

  const responseHeadersMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: (input: { name: string; value: string }) => {
        varBinding = `{{ info.headers.[${input.name}] }}`
        addVariableModal.show()
      },
    },
  ]

  const compareResponseType = (option: any, value: any) =>
    option.type === value?.type

  const handleSchemaChange = (
    e: CustomEvent<{ fields: Array<{ name: string; value: any }> }>
  ) => {
    schema = keyValueArrayToRecord(e.detail.fields)
    dispatch("change", { schema })
  }

  const handleDynamicVariableChange = (e: CustomEvent<Record<string, any>>) => {
    dynamicVariables = e.detail
    dispatch("change", { dynamicVariables })
  }

  const handleDynamicVariablesUpdate = (
    e: CustomEvent<{ fields: Array<{ name: string; value: any }> }>
  ) => {
    dynamicVariables = keyValueArrayToRecord(e.detail.fields)
    dispatch("change", { dynamicVariables })
  }
</script>

<DynamicVariableModal
  {datasource}
  {dynamicVariables}
  binding={varBinding}
  bind:this={addVariableModal}
  on:change={handleDynamicVariableChange}
/>
<div class="side-bar-wrap">
  <Layout noPadding gap="S" alignContent="start">
    {#if !response && (!schema || Object.keys(schema).length === 0)}
      <div class="placeholder">-</div>
    {:else}
      {#if response}
        <div class="stats" class:compact={!fullscreen}>
          <Label size="L">
            Status: <span class={responseSuccess ? "green" : "red"}
              >{response?.info.code}</span
            >
          </Label>
          <Label size="L">
            Time: <span class={responseSuccess ? "green" : "red"}
              >{response?.info.time}</span
            >
          </Label>
          <Label size="L">
            Size: <span class={responseSuccess ? "green" : "red"}
              >{response?.info.size}</span
            >
          </Label>
        </div>
      {/if}
      {#if !fullscreen}
        <Select
          quiet
          value={selectedTab}
          options={tabOptions}
          on:change={handleTabChange}
          placeholder={false}
        />
      {/if}
      <Tabs
        selected={selectedTab || "Schema"}
        quiet
        noPadding
        noHorizPadding
        hideTabsList={!fullscreen}
        on:select={handleTabChange}
      >
        {#if response}
          <Tab title="JSON">
            <div class="embed">
              <CodeEditor
                value={JSON.stringify(response.rows[0] || {}, null, 2)}
                readonly
                readonlyLineNumbers={false}
                mode={EditorModes.JSON}
              />
            </div>
          </Tab>
          <Tab title="Raw">
            <div class="raw">
              <CoreTextArea
                disabled
                value={response.extra?.raw}
                height="100%"
              />
            </div>
          </Tab>
          <Tab title="Headers">
            <KeyValueBuilder
              object={response.extra?.headers}
              readOnly
              menuItems={responseHeadersMenuItems}
              showMenu={true}
            />
          </Tab>
        {/if}
        {#if schema || response}
          <Tab title="Schema">
            <KeyValueBuilder
              defaults={schema}
              name="schema"
              headings
              options={SchemaTypeOptionsExpanded}
              menuItems={schemaMenuItems}
              showMenu={responseSuccess}
              readOnly={!responseSuccess}
              compare={compareResponseType}
              on:change={handleSchemaChange}
            />
          </Tab>
        {/if}
        {#if showVariables}
          <Tab title="Dynamic Variables">
            <Layout noPadding gap="S">
              <Body size="S">
                Create dynamic variables based on response body or headers from
                this query.
              </Body>
              <KeyValueBuilder
                defaults={dynamicVariables}
                name="Variable"
                headings
                keyHeading="Name"
                keyPlaceholder="Variable name"
                valueHeading={`Value`}
                valuePlaceholder={`{{ value }}`}
                readOnly={!responseSuccess}
                on:change={handleDynamicVariablesUpdate}
              />
            </Layout>
          </Tab>
        {/if}
      </Tabs>
    {/if}
  </Layout>
</div>

<style>
  .side-bar-wrap {
    height: 100%;
  }
  .side-bar-wrap :global(> .container) {
    height: 100%;
    grid-template-rows: auto auto 1fr;
  }
  /* Tab content fills its 1fr grid row */
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"]),
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] > div) {
    height: 100%;
    overflow-y: auto;
  }
  /* Raw tab */
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] .raw) {
    height: 100%;
    overflow: hidden;
  }
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] .raw textarea) {
    min-height: unset !important;
    resize: none;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
  /* JSON tab  */
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] .embed),
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] .embed .code-editor),
  .side-bar-wrap
    :global([class*="spectrum-Tabs-content-"] .embed .code-editor > div) {
    height: 100% !important;
    overflow: hidden;
  }
  .side-bar-wrap :global([class*="spectrum-Tabs-content-"] .embed .cm-editor) {
    height: 100% !important;
    min-height: unset;
    overflow-y: auto;
  }
  .placeholder {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--spectrum-global-color-gray-600);
  }
  .stats {
    display: flex;
    gap: var(--spacing-m);
  }
  .green {
    color: var(--spectrum-global-color-green-600);
  }
  .red {
    color: var(--spectrum-global-color-red-600);
  }
  .embed :global(.cm-editor) {
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }

  .embed :global(.cm-gutters) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
</style>
