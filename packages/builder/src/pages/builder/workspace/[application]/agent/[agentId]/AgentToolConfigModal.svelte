<script lang="ts">
  import {
    Body,
    Heading,
    Modal,
    ModalContent,
    TextArea,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import {
    ToolSourceType,
    type AgentToolSource,
    type CreateToolSourceRequest,
    type AgentToolSourceWithTools,
    type Tool,
    type ToolSourceOption,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { createEventDispatcher, type ComponentType } from "svelte"
  import BudibaseLogo from "../logos/Budibase.svelte"
  import { API } from "@/api"
  import RestQueryToolConfig from "./RestQueryToolConfig.svelte"

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

  // We only allow one Budibase tool source per agent
  $: hasBudibaseSource = $agentsStore.toolSources.some(
    ts => ts.type === ToolSourceType.BUDIBASE
  )
  $: availableToolSources = ToolSources.filter(
    source => !(source.type === ToolSourceType.BUDIBASE && hasBudibaseSource)
  )

  const fetchBudibaseTools = async (sourceType: ToolSourceType) => {
    try {
      toolsList = await API.fetchAvailableTools(sourceType)
    } catch (error) {
      console.error("Error fetching Budibase tools:", error)
      notifications.error("Failed to load Budibase tools")
    }
  }

  const resetForm = () => {
    mode = "select"
    editingSource = null
    selectedSourceType = null
    guidelines = ""
    disabledTools = []
    toolsList = []
    label = ""
    selectedDatasourceId = ""
    selectedQueryIds = []
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
        selectedDatasourceId = sourceToEdit.datasourceId || ""
        selectedQueryIds = [...(sourceToEdit.queryIds || [])]
      } else {
        selectedDatasourceId = ""
        selectedQueryIds = []
      }

      const needsToolsFetch =
        sourceToEdit.type === ToolSourceType.BUDIBASE &&
        (!toolsList || toolsList.length === 0)
      if (needsToolsFetch) {
        fetchBudibaseTools(sourceToEdit.type)
      }
    } else {
      resetForm()
    }
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  const selectSource = async (source: ToolSourceOption) => {
    selectedSourceType = source
    mode = "configure"
    guidelines = ""
    disabledTools = []
    toolsList = []
    label = ""
    selectedDatasourceId = ""
    selectedQueryIds = []

    if (source.type === ToolSourceType.BUDIBASE) {
      await fetchBudibaseTools(source.type)
    }
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
            disabledTools,
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
          <RestQueryToolConfig
            {toggleQuery}
            {editingSource}
            bind:selectedDatasourceId
            bind:selectedQueryIds
            bind:label
          />
        {/if}

        {#if toolsList.length > 0 && selectedSourceType?.type === ToolSourceType.BUDIBASE}
          <div class="tools-section">
            <Heading size="XS">Enabled Tools</Heading>
            <Body size="S" color="var(--spectrum-global-color-gray-700)">
              Select which tools the agent can use.
            </Body>
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
        <div class="guidelines-section">
          <TextArea
            label="Tool Source Guidelines"
            bind:value={guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        </div>
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

  .guidelines-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
