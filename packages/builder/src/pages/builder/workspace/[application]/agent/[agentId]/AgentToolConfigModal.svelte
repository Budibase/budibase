<script lang="ts">
  import {
    Body,
    Heading,
    Icon,
    Input,
    Modal,
    ModalContent,
    TextArea,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import type {
    AgentToolSource,
    CreateToolSourceRequest,
    AgentToolSourceWithTools,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { createEventDispatcher, type ComponentType } from "svelte"
  import BambooHRLogo from "../logos/BambooHR.svelte"
  import BudibaseLogo from "../logos/Budibase.svelte"
  import ConfluenceLogo from "../logos/Confluence.svelte"
  import GithubLogo from "../logos/Github.svelte"

  const Logos: Record<string, ComponentType> = {
    BUDIBASE: BudibaseLogo,
    CONFLUENCE: ConfluenceLogo,
    GITHUB: GithubLogo,
    BAMBOOHR: BambooHRLogo,
  }

  const ToolSources = [
    {
      name: "Budibase",
      type: "BUDIBASE",
      description: "Connect agent to your Budibase tools",
    },
    {
      name: "Github",
      type: "GITHUB",
      description: "Automate development workflows.",
    },
    {
      name: "Confluence",
      type: "CONFLUENCE",
      description: "Connect agent to your teams documentation",
    },
    {
      name: "Sharepoint",
      type: "SHAREPOINT",
      description: "Sharepoint stuff",
    },
    {
      name: "JIRA Service Manaagement",
      type: "JIRA_SM",
      description: "Automate ITSM Workflows",
    },
    {
      name: "BambooHR",
      type: "BAMBOOHR",
      description: "Automate HR workflows and employee management",
    },
  ]

  export let agentId: string

  const dispatch = createEventDispatcher()

  let modal: Modal
  let mode: "select" | "configure" = "select"
  let selectedSourceType: any = null
  let editingSource: AgentToolSourceWithTools | null = null

  let config: Record<string, string> = {}
  let disabledTools: string[] = []
  let toolsList: any[] = []

  export function show(sourceToEdit?: AgentToolSourceWithTools) {
    if (sourceToEdit) {
      mode = "configure"
      editingSource = sourceToEdit
      selectedSourceType = ToolSources.find(s => s.type === sourceToEdit.type)
      config = { ...sourceToEdit.auth }
      disabledTools = [...(sourceToEdit.disabledTools || [])]
      toolsList = sourceToEdit.tools || []
    } else {
      mode = "select"
      editingSource = null
      selectedSourceType = null
      config = {}
      disabledTools = []
      toolsList = []
    }
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  function selectSource(source: any) {
    selectedSourceType = source
    mode = "configure"
    config = {}
    disabledTools = []
    toolsList = []
  }

  function toggleTool(toolName: string) {
    if (disabledTools.includes(toolName)) {
      disabledTools = disabledTools.filter(t => t !== toolName)
    } else {
      disabledTools = [...disabledTools, toolName]
    }
  }

  async function save() {
    try {
      if (editingSource) {
        const updatedSource = {
          ...editingSource,
          auth: config,
          disabledTools,
          agentId,
        }
        await agentsStore.updateToolSource(
          updatedSource as unknown as AgentToolSource // could be any of the tool source auth types so we have to cast here unfortunately.
        )
        notifications.success("Tool source updated successfully")
      } else {
        const newSource: CreateToolSourceRequest = {
          type: selectedSourceType.type,
          agentId,
          auth: config,
          disabledTools: [],
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
      : `${editingSource ? "Edit" : "Configure"} ${selectedSourceType?.name || "Tool"}`}
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
        {#each ToolSources as source}
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
            {#if $agentsStore.toolSources.some(ts => ts.type === source.type)}
              <div class="connected-badge">
                <Icon name="CheckmarkCircle" size="S" />
                Connected
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else if mode === "configure" && selectedSourceType}
      <div class="config-form">
        <div class="auth-section">
          <Heading size="XS">Authentication</Heading>
          {#if selectedSourceType.type === "GITHUB"}
            <Input
              label="API Key"
              bind:value={config.apiKey}
              type="password"
              placeholder="Enter your GitHub API token"
            />
            <Input
              label="Base URL (Optional)"
              bind:value={config.baseUrl}
              type="text"
              placeholder="https://api.github.com (leave empty for default)"
            />
          {:else if selectedSourceType.type === "CONFLUENCE"}
            <Input
              label="API Key"
              bind:value={config.apiKey}
              type="password"
              placeholder="Enter your Confluence API token"
            />
            <Input
              label="Email Address"
              bind:value={config.email}
              type="email"
              placeholder="your.email@domain.com"
              helpText="Your Atlassian account email address"
            />
            <Input
              label="Base URL (Optional)"
              bind:value={config.baseUrl}
              type="text"
              placeholder="https://your-domain.atlassian.net"
            />
          {:else if selectedSourceType.type === "BAMBOOHR"}
            <Input
              label="API Key"
              bind:value={config.apiKey}
              type="password"
              placeholder="Enter your BambooHR API key"
            />
            <Input
              label="Subdomain"
              bind:value={config.subdomain}
              type="text"
              placeholder="your-company"
              helpText="Your BambooHR subdomain (e.g., 'mycompany' for mycompany.bamboohr.com)"
            />
          {/if}
          <TextArea
            label="Tool Source Guidelines"
            bind:value={config.guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        </div>

        {#if editingSource && toolsList.length > 0}
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

  .connected-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-green-500);
    font-size: var(--font-size-s);
    margin-top: auto;
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .auth-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
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
</style>
