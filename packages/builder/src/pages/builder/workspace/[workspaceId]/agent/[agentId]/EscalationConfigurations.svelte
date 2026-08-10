<script lang="ts">
  import { ActionButton, Body, Button, Helpers, Input } from "@budibase/bbui"
  import type {
    Agent,
    AgentEscalationConfig,
    AgentOperationToolConfig,
    EscalationRecipient,
  } from "@budibase/types"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import type { AgentTool } from "./toolTypes"

  let {
    agent = $bindable(),
    agentId,
    availableTools = [],
    onUpdated,
  }: {
    agent: Agent
    agentId?: string
    availableTools?: AgentTool[]
    onUpdated: () => Promise<boolean>
  } = $props()

  let adding = $state(false)
  let pendingName = $state("")
  let pendingRecipients = $state<EscalationRecipient[]>([])
  let recipientEditorOpen = $state(false)

  const normalizeName = (name: string) => name.trim().toLowerCase()
  const nameExists = (name: string, exceptId?: string) =>
    (agent.escalationConfigs || []).some(
      config =>
        config.id !== exceptId &&
        normalizeName(config.name) === normalizeName(name)
    )

  const updateConfig = (id: string, update: Partial<AgentEscalationConfig>) => {
    agent.escalationConfigs = (agent.escalationConfigs || []).map(config =>
      config.id === id ? { ...config, ...update } : config
    )
    onUpdated()
  }

  const updateConfigName = (config: AgentEscalationConfig, name: string) => {
    const trimmed = name.trim()
    if (!trimmed || nameExists(trimmed, config.id)) {
      return
    }
    updateConfig(config.id, { name: trimmed })
  }

  const formatFallbackToolName = (toolName: string) => {
    const action = toolName.match(
      /(create_row|update_row|delete_row|get_row|list_rows|get_table|list_tables)$/
    )?.[1]
    return (action || toolName)
      .split("_")
      .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" ")
  }

  const formatToolName = (toolConfig: AgentOperationToolConfig) => {
    const tool = availableTools.find(
      candidate => candidate.runtimeBinding === toolConfig.toolName
    )
    const displayName = tool?.readableName || tool?.name
    if (!tool || !displayName) {
      return formatFallbackToolName(toolConfig.toolName)
    }
    if (tool.sourceLabel && !displayName.startsWith(`${tool.sourceLabel}.`)) {
      return `${tool.sourceLabel}: ${displayName}`
    }
    return displayName
  }

  const referencesFor = (id: string) =>
    (agent.operations || []).flatMap(operation =>
      (operation.enabledTools || [])
        .filter(tool => tool.escalationConfigId === id)
        .map(toolConfig => {
          return `${operation.name} · ${formatToolName(toolConfig)}`
        })
    )

  const addConfig = () => {
    const name = pendingName.trim()
    if (!name || !pendingRecipients.length || nameExists(name)) {
      return
    }
    agent.escalationConfigs = [
      ...(agent.escalationConfigs || []),
      {
        id: `escalation_config_${Helpers.uuid()}`,
        name,
        recipients: pendingRecipients,
      },
    ]
    pendingName = ""
    pendingRecipients = []
    recipientEditorOpen = false
    adding = false
    onUpdated()
  }

  const deleteConfig = (id: string) => {
    if (referencesFor(id).length) {
      return
    }
    agent.escalationConfigs = (agent.escalationConfigs || []).filter(
      config => config.id !== id
    )
    onUpdated()
  }
</script>

<section class="escalation-configurations">
  <div class="configurations-header">
    <div class="section-header">
      <Body size="XS" color="var(--spectrum-global-color-gray-900)"
        >Escalation configurations</Body
      >
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Create reusable approval destinations for this agent's tools.
      </Body>
    </div>
    {#if !adding}
      <Button secondary size="S" icon="plus" on:click={() => (adding = true)}>
        Add configuration
      </Button>
    {/if}
  </div>

  {#each agent.escalationConfigs || [] as config (config.id)}
    {@const references = referencesFor(config.id)}
    <div class="configuration">
      <div class="configuration-main">
        <div class="configuration-fields">
          <Input
            label="Name"
            value={config.name}
            error={!config.name.trim()
              ? "Name is required"
              : nameExists(config.name, config.id)
                ? "Name must be unique"
                : undefined}
            on:change={event => updateConfigName(config, event.detail)}
          />
          <div class="destination-field">
            <Body size="XS" color="var(--spectrum-global-color-gray-800)"
              >Recipients</Body
            >
            <EscalationRecipients
              recipients={config.recipients}
              minimumRecipients={1}
              {agentId}
              onChange={recipients => {
                if (recipients.length) {
                  updateConfig(config.id, { recipients })
                }
              }}
            />
          </div>
        </div>
        {#if references.length}
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Used by {references.join(", ")}
          </Body>
        {/if}
      </div>
      <ActionButton
        icon="Delete"
        disabled={references.length > 0}
        tooltip={references.length > 0
          ? "Remove tool references before deleting"
          : "Delete configuration"}
        on:click={() => deleteConfig(config.id)}
      />
    </div>
  {/each}

  {#if adding}
    <div class="configuration add-configuration">
      <Input
        label="Name"
        placeholder="Engineering"
        bind:value={pendingName}
        error={nameExists(pendingName) ? "Name must be unique" : undefined}
      />
      <EscalationRecipients
        recipients={pendingRecipients}
        {agentId}
        onChange={recipients =>
          (pendingRecipients = recipients as EscalationRecipient[])}
        onAddingChange={adding => (recipientEditorOpen = adding)}
      />
      {#if !recipientEditorOpen}
        <div class="add-actions">
          {#if pendingRecipients.length}
            <Button
              cta
              disabled={!pendingName.trim() || nameExists(pendingName)}
              on:click={addConfig}>Create</Button
            >
          {/if}
          <Button
            secondary
            on:click={() => {
              adding = false
              pendingName = ""
              pendingRecipients = []
              recipientEditorOpen = false
            }}>Cancel</Button
          >
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  .escalation-configurations {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin: var(--spacing-xl) 0;
  }
  .configurations-header,
  .configuration-fields,
  .add-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .configurations-header {
    justify-content: space-between;
    gap: var(--spacing-l);
  }
  .section-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 600px;
  }
  .section-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
  .configuration {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
  }
  .configuration-fields {
    flex: 1;
    min-width: 0;
  }
  .configuration-main,
  .destination-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .configuration-main {
    flex: 1;
    min-width: 0;
  }
  .destination-field {
    flex: 1;
  }
  .configuration-fields :global(.recipients) {
    flex: 1;
  }
  .add-configuration {
    align-items: flex-end;
  }
</style>
