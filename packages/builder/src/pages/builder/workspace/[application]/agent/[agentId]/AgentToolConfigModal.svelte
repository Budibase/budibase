<script lang="ts">
  import {
    Body,
    Heading,
    Input,
    Modal,
    ModalContent,
    Select,
    TextArea,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import {
    ToolSourceType,
    type AgentToolSource,
    type CreateToolSourceRequest,
    type AgentToolSourceWithTools,
    type Query,
    type Tool,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { datasources, queries } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"
  import { createEventDispatcher, type ComponentType } from "svelte"
  import BudibaseLogo from "../logos/Budibase.svelte"

  interface ToolSourceOption {
    name: string
    type: ToolSourceType
    description: string
  }
  export let agentId: string

  const Logos: Record<string, ComponentType> = {
    BUDIBASE: BudibaseLogo,
  }

  const ToolSources = [
    {
      name: "Budibase",
      type: ToolSourceType.BUDIBASE,
      description: "Connect agent to your Budibase tools",
    },
    {
      name: "REST API",
      type: ToolSourceType.REST_QUERY,
      description: "Use queries from your REST APIs as agent tools",
    },
  ]

  const dispatch = createEventDispatcher()

  let modal: Modal
  let mode: "select" | "configure" = "select"
  let selectedSourceType: ToolSourceOption | null = null
  let editingSource: AgentToolSourceWithTools | null = null

  let guidelines = ""
  let disabledTools: string[] = []
  let toolsList: Tool[] = []
  let label = ""

  let selectedDatasourceId: string = ""
  let selectedQueryIds: string[] = []

  $: restDatasources = ($datasources.list || []).filter(
    ds => ds.source === IntegrationTypes.REST
  )

  // We only allow one Budibase tool source per agent
  $: hasBudibaseSource = $agentsStore.toolSources.some(
    ts => ts.type === ToolSourceType.BUDIBASE
  )
  $: availableToolSources = ToolSources.filter(
    source => !(source.type === ToolSourceType.BUDIBASE && hasBudibaseSource)
  )

  $: datasourceOptions = restDatasources.map(ds => ({
    label: ds.name || ds._id!,
    value: ds._id!,
  }))

  $: queriesForDatasource = ($queries.list || []).filter(
    (q: Query) => q.datasourceId === selectedDatasourceId
  )

  // Auto-populate label and queries when datasource changes
  let previousDatasourceId = ""
  $: if (
    selectedDatasourceId &&
    selectedDatasourceId !== previousDatasourceId
  ) {
    const isInitialLoad = !previousDatasourceId && editingSource
    previousDatasourceId = selectedDatasourceId

    if (!isInitialLoad) {
      if (!editingSource) {
        const ds = restDatasources.find(d => d._id === selectedDatasourceId)
        if (ds) {
          label = ds.name || ""
        }
      }
      const allQueries = ($queries.list || []).filter(
        (q: Query) => q.datasourceId === selectedDatasourceId
      )
      selectedQueryIds = allQueries
        .map(q => q._id)
        .filter((id): id is string => !!id)
    }
  }

  export function show(sourceToEdit?: AgentToolSourceWithTools) {
    if (sourceToEdit) {
      mode = "configure"
      editingSource = sourceToEdit
      selectedSourceType =
        ToolSources.find(s => s.type === sourceToEdit.type) || null
      guidelines = sourceToEdit.auth.guidelines || ""
      disabledTools = [...(sourceToEdit.disabledTools || [])]
      toolsList = sourceToEdit.tools || []
      label = sourceToEdit.label || ""

      if (sourceToEdit.type === ToolSourceType.REST_QUERY) {
        const restSource = sourceToEdit
        selectedDatasourceId = restSource.datasourceId || ""
        selectedQueryIds = [...(restSource.queryIds || [])]
      } else {
        selectedDatasourceId = ""
        selectedQueryIds = []
      }
    } else {
      mode = "select"
      editingSource = null
      selectedSourceType = null
      guidelines = ""
      disabledTools = []
      toolsList = []
      label = ""
      selectedDatasourceId = ""
      selectedQueryIds = []
      previousDatasourceId = ""
    }
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  function selectSource(source: ToolSourceOption) {
    selectedSourceType = source
    mode = "configure"
    guidelines = ""
    disabledTools = []
    toolsList = []
    label = ""
    selectedDatasourceId = ""
    selectedQueryIds = []
    previousDatasourceId = ""
  }

  function toggleTool(toolName: string) {
    if (disabledTools.includes(toolName)) {
      disabledTools = disabledTools.filter(t => t !== toolName)
    } else {
      disabledTools = [...disabledTools, toolName]
    }
  }

  function toggleQuery(queryId: string) {
    if (selectedQueryIds.includes(queryId)) {
      selectedQueryIds = selectedQueryIds.filter(id => id !== queryId)
    } else {
      selectedQueryIds = [...selectedQueryIds, queryId]
    }
  }

  async function save() {
    try {
      if (selectedSourceType?.type === ToolSourceType.REST_QUERY) {
        if (!selectedDatasourceId) {
          notifications.error("Please select a datasource")
          return
        }
        if (selectedQueryIds.length === 0) {
          notifications.error("Please select at least one query")
          return
        }
      }

      const basePayload = {
        auth: { guidelines },
        agentId,
        label: label || undefined,
      }

      if (editingSource) {
        const updatedSource: AgentToolSource =
          selectedSourceType?.type === ToolSourceType.REST_QUERY
            ? {
                ...editingSource,
                ...basePayload,
                type: ToolSourceType.REST_QUERY,
                disabledTools,
                datasourceId: selectedDatasourceId,
                queryIds: selectedQueryIds,
              }
            : {
                ...editingSource,
                ...basePayload,
                type: ToolSourceType.BUDIBASE,
                disabledTools,
              }

        await agentsStore.updateToolSource(updatedSource)
        notifications.success("Tool source updated successfully")
      } else {
        let newSource: CreateToolSourceRequest
        if (selectedSourceType?.type === ToolSourceType.REST_QUERY) {
          newSource = {
            type: ToolSourceType.REST_QUERY,
            agentId,
            label: label || undefined,
            auth: { guidelines },
            disabledTools: [],
            datasourceId: selectedDatasourceId,
            queryIds: selectedQueryIds,
          }
        } else {
          newSource = {
            type: ToolSourceType.BUDIBASE,
            auth: { guidelines },
            agentId,
            disabledTools: [],
          }
        }

        await agentsStore.createToolSource(newSource)
        notifications.success("Tool source added successfully")
      }
      dispatch("saved")
      modal.hide()
    } catch (error: any) {
      console.error(error)
      notifications.error(`Error saving tool source: ${error.message}`)
    }
  }

  function goBack() {
    if (editingSource) {
      modal.hide()
    } else {
      mode = "select"
      selectedSourceType = null
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={mode === "select"
      ? "Add Tool"
      : `${editingSource ? "Edit" : "Configure"} ${editingSource?.label || selectedSourceType?.name || "Tool"}`}
    size="L"
    showCloseIcon
    showCancelButton={mode === "configure"}
    cancelText="Back"
    showConfirmButton={mode === "configure"}
    confirmText="Save"
    onCancel={goBack}
    onConfirm={save}
  >
    {#if mode === "select"}
      <div class="sources-grid">
        {#each availableToolSources as source}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="source-card" on:click={() => selectSource(source)}>
            <div class="source-header">
              {#if Logos[source.type]}
                <div class="source-icon">
                  <svelte:component
                    this={Logos[source.type]}
                    height="24"
                    width="24"
                  />
                </div>
              {/if}
              <Heading size="XS">{source.name}</Heading>
            </div>
            <Body size="S" color="var(--spectrum-global-color-gray-700)">
              {source.description}
            </Body>
          </div>
        {/each}
      </div>
    {:else if mode === "configure" && selectedSourceType}
      <div class="config-form">
        {#if selectedSourceType.type === ToolSourceType.REST_QUERY}
          <div class="rest-query-section">
            <Heading size="XS">Select API</Heading>
            {#if restDatasources.length === 0}
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                No REST APIs found. Create a REST API in the APIs section first.
              </Body>
            {:else}
              <Select
                label="REST API"
                bind:value={selectedDatasourceId}
                options={datasourceOptions}
                placeholder="Select a REST API"
              />

              {#if selectedDatasourceId}
                <Input
                  label="Tool Source Name"
                  bind:value={label}
                  placeholder="e.g. GitHub, Confluence, Jira"
                />
                <div class="queries-section">
                  <Heading size="XS">Select Queries</Heading>
                  {#if queriesForDatasource.length === 0}
                    <Body
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    >
                      No queries found for this API. Create queries in the APIs
                      section first.
                    </Body>
                  {:else}
                    <Body
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    >
                      Select which queries the agent can use as tools.
                    </Body>
                    <div class="queries-list">
                      {#each queriesForDatasource as query}
                        <div class="query-item">
                          <div class="query-info">
                            <div class="query-name">{query.name}</div>
                          </div>
                          <Toggle
                            value={selectedQueryIds.includes(query._id || "")}
                            on:change={() => toggleQuery(query._id || "")}
                          />
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}
            {/if}
          </div>
        {/if}

        <div class="guidelines-section">
          <TextArea
            label="Tool Source Guidelines"
            bind:value={guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        </div>

        {#if editingSource && toolsList.length > 0 && selectedSourceType?.type !== ToolSourceType.REST_QUERY}
          <div class="tools-section">
            <Heading size="XS">Enabled Tools</Heading>
            <div class="tools-list">
              {#each toolsList as tool}
                <div class="tool-item">
                  <div class="tool-info">
                    <div class="tool-name">{tool.name}</div>
                    <div class="tool-desc">{tool.description}</div>
                  </div>
                  <Toggle
                    value={!disabledTools.includes(tool.name)}
                    on:change={() => toggleTool(tool.name)}
                  />
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .sources-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-m);
  }

  .source-card {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    padding: var(--spacing-l);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    transition: border-color 0.2s;
    position: relative;
  }

  .source-card:hover {
    border-color: var(--spectrum-global-color-gray-500);
    background-color: var(--spectrum-alias-background-color-hover-overlay);
  }

  .source-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .source-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .tools-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    padding: var(--spacing-s);
    max-height: 300px;
    overflow-y: auto;
  }

  .tool-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-100);
  }

  .tool-item:last-child {
    border-bottom: none;
  }

  .tool-info {
    flex: 1;
    margin-right: var(--spacing-m);
  }

  .tool-name {
    font-weight: 600;
    font-size: var(--font-size-s);
    font-family: var(--font-mono);
  }

  .tool-desc {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-700);
  }

  .rest-query-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .queries-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-top: var(--spacing-m);
  }

  .queries-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    padding: var(--spacing-s);
    max-height: 300px;
    overflow-y: auto;
  }

  .query-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-100);
  }

  .query-item:last-child {
    border-bottom: none;
  }

  .query-info {
    flex: 1;
    margin-right: var(--spacing-m);
  }

  .query-name {
    font-weight: 600;
    font-size: var(--font-size-s);
  }

  .guidelines-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
